import cors from "cors";
import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

dotenv.config();

type MovieSort = "featured" | "rating" | "title";

type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

type TmdbDiscoverResponse = {
  results: TmdbMovie[];
};

type TmdbGenreResponse = {
  genres: Array<{ id: number; name: string }>;
};

type Movie = {
  id: string;
  title: string;
  year: number;
  releaseDate: string;
  rating: number;
  genre: string;
  synopsis: string;
  poster: string;
  rank: number;
};

class TmdbError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export const app = express();
export default app;
const allowedOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";
const tmdbToken = process.env.TMDB_READ_ACCESS_TOKEN;
const configuredTimelineYears = Number(process.env.TIMELINE_YEARS ?? 6);
const timelineYears = Number.isInteger(configuredTimelineYears) && configuredTimelineYears > 0
  ? configuredTimelineYears
  : 6;
const cacheDurationMs = 10 * 60 * 1000;
let timelineCache: { expiresAt: number; movies: Movie[] } | undefined;

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

function sortMovies(list: Movie[], sort: MovieSort) {
  return [...list].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "title") return a.title.localeCompare(b.title);
    return a.rank - b.rank;
  });
}

async function tmdbGet<T>(path: string, params: URLSearchParams): Promise<T> {
  if (!tmdbToken) {
    throw new TmdbError("TMDB_READ_ACCESS_TOKEN is not configured.", 503);
  }

  const response = await fetch(`https://api.themoviedb.org/3${path}?${params}`, {
    headers: { Authorization: `Bearer ${tmdbToken}`, Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new TmdbError("TMDB did not return movie data.", response.status === 401 ? 502 : response.status);
  }

  return response.json() as Promise<T>;
}

async function getGenreNames() {
  const response = await tmdbGet<TmdbGenreResponse>("/genre/movie/list", new URLSearchParams({ language: "en-US" }));
  return new Map(response.genres.map((genre) => [genre.id, genre.name]));
}

async function getMoviesForYear(year: number, genreNames: Map<number, string>) {
  const response = await tmdbGet<TmdbDiscoverResponse>("/discover/movie", new URLSearchParams({
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    primary_release_year: String(year),
    sort_by: "popularity.desc",
  }));

  return response.results
    .filter((movie) => movie.poster_path && movie.release_date)
    .slice(0, 8)
    .map((movie, index): Movie => ({
      id: String(movie.id),
      title: movie.title,
      year,
      releaseDate: movie.release_date,
      rating: Number(movie.vote_average.toFixed(1)),
      genre: movie.genre_ids.map((id) => genreNames.get(id)).filter(Boolean).slice(0, 2).join(" / ") || "Feature film",
      synopsis: movie.overview || "No overview is available from TMDB for this film.",
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rank: index + 1,
    }));
}

async function getTimelineMovies() {
  if (timelineCache && timelineCache.expiresAt > Date.now()) return timelineCache.movies;

  const currentYear = new Date().getUTCFullYear();
  const years = Array.from({ length: timelineYears }, (_, index) => currentYear - index);
  const genreNames = await getGenreNames();
  const yearlyMovies = await Promise.all(years.map((year) => getMoviesForYear(year, genreNames)));
  const movies = yearlyMovies.flat();

  timelineCache = { movies, expiresAt: Date.now() + cacheDurationMs };
  return movies;
}

app.get("/api/health", (_request: Request, response: Response) => {
  response.json({ status: "ok", tmdbConfigured: Boolean(tmdbToken) });
});

app.get("/api/movies/:year", async (request: Request, response: Response) => {
  try {
    const year = Number(request.params.year);
    if (!Number.isInteger(year) || year < 1800 || year > new Date().getUTCFullYear() + 5) {
      response.status(400).json({ error: "Invalid year parameter." });
      return;
    }
    const sort = request.query.sort;
    const validSort: MovieSort = sort === "rating" || sort === "title" ? sort : "featured";
    const genreNames = await getGenreNames();
    const movies = await getMoviesForYear(year, genreNames);

    response.json({ data: sortMovies(movies, validSort) });
  } catch (error) {
    sendTmdbError(response, error);
  }
});

app.get("/api/movie/:id", async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    
    // TMDB /movie/:id returns genres as an array of objects
    const movie = await tmdbGet<TmdbMovie & { genres: Array<{id: number; name: string}> }>(`/movie/${id}`, new URLSearchParams({
      language: "en-US",
    }));

    if (!movie.poster_path) {
        response.status(404).json({ error: "Movie not found" });
        return;
    }

    const formattedMovie: Movie = {
      id: String(movie.id),
      title: movie.title,
      year: parseInt(movie.release_date.split("-")[0] || "0"),
      releaseDate: movie.release_date,
      rating: Number(movie.vote_average.toFixed(1)),
      genre: movie.genres ? movie.genres.map(g => g.name).slice(0, 2).join(" / ") : "Feature film",
      synopsis: movie.overview || "No overview is available from TMDB for this film.",
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rank: 1,
    };

    response.json({ data: formattedMovie });
  } catch (error) {
    sendTmdbError(response, error);
  }
});

app.get("/api/movies", async (request: Request, response: Response) => {
  try {
    const requestedYear = Number(request.query.year);
    const sort = request.query.sort;
    const validSort: MovieSort = sort === "rating" || sort === "title" ? sort : "featured";
    const movies = await getTimelineMovies();
    const selectedMovies = Number.isInteger(requestedYear)
      ? movies.filter((movie) => movie.year === requestedYear)
      : movies;

    response.json({ data: sortMovies(selectedMovies, validSort) });
  } catch (error) {
    sendTmdbError(response, error);
  }
});

function sendTmdbError(response: Response, error: unknown) {
  if (error instanceof TmdbError) {
    response.status(error.status).json({ error: error.message });
    return;
  }

  response.status(502).json({ error: "Unable to retrieve movie data from TMDB." });
}

app.use((_request: Request, response: Response) => {
  response.status(404).json({ error: "Route not found" });
});
