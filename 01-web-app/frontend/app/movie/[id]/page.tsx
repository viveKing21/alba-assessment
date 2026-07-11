"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState, type MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Movie = {
  id: string;
  title: string;
  year: number;
  releaseDate: string;
  rating: number;
  genre: string;
  synopsis: string;
  poster: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>;
}

function StarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>;
}

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sort = searchParams.get("sort") ?? "featured";
  const timelineHref = `/?sort=${encodeURIComponent(sort)}`;
  const returnedFromTimeline = searchParams.get("returnToTimeline") === "1";

  function returnToTimeline(event: MouseEvent<HTMLAnchorElement>) {
    if (!returnedFromTimeline || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    router.back();
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovie() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiUrl}/api/movie/${id}`, { signal: controller.signal });
        const payload = (await response.json()) as { data?: Movie; error?: string };
        if (!response.ok || !payload.data) throw new Error(payload.error ?? "This film is unavailable.");
        setMovie(payload.data);
      } catch (reason) {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "This film is unavailable.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadMovie();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <main className="movie-page-shell"><div className="detail-nav"><Link href={timelineHref} className="back-link" onClick={returnToTimeline}><BackIcon />Timeline</Link><span className="detail-mark">Reeltime archive</span></div><section className="detail-hero loading-state" aria-label="Loading movie"><span /></section></main>;
  }

  if (error || !movie) {
    return <main className="movie-page-shell"><div className="detail-nav"><Link href={timelineHref} className="back-link" onClick={returnToTimeline}><BackIcon />Timeline</Link><span className="detail-mark">Reeltime archive</span></div><section className="detail-hero error-state"><div><h1>{error ?? "Film unavailable"}</h1><Link href={timelineHref} className="back-link" onClick={returnToTimeline}><BackIcon />Return to the archive</Link></div></section></main>;
  }

  const genres = movie.genre.split(" / ").filter(Boolean);
  const releaseDate = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(new Date(movie.releaseDate));

  return (
    <main className="movie-page-shell">
      <nav className="detail-nav" aria-label="Movie navigation">
        <Link href={timelineHref} className="back-link" onClick={returnToTimeline}><BackIcon />Back to timeline</Link>
        <span className="detail-mark">Reeltime archive</span>
      </nav>
      <article className="detail-hero">
        <header className="detail-head">
          <div>
            <p className="detail-kicker">Selected from the {movie.year} collection</p>
            <h1>{movie.title}</h1>
            <p className="detail-meta"><span>{movie.year}</span><span>•</span><span>{genres.join(" · ")}</span></p>
          </div>
          <div className="detail-rating" aria-label={`Rating ${movie.rating} out of 10`}>
            <span>TMDB audience rating</span>
            <strong><StarIcon />{movie.rating.toFixed(1)} <em>/ 10</em></strong>
          </div>
        </header>
        <div className="detail-content">
          <div className="detail-poster"><Image src={movie.poster} alt={`${movie.title} poster`} fill priority sizes="(max-width: 700px) 72vw, 300px" /></div>
          <div className="detail-copy">
            <div className="genre-list">{genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
            <p>{movie.synopsis}</p>
            <dl className="detail-facts"><dt>Release date</dt><dd>{releaseDate}</dd><dt>Collection</dt><dd>{movie.year} annual selection</dd></dl>
          </div>
        </div>
      </article>
    </main>
  );
}
