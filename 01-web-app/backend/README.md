# Reeltime API

The Reeltime API is an Express 5 and TypeScript service that retrieves movie data from TMDB and maps it into the response shape used by the Next.js frontend.

## Requirements

- Node.js 20 or later
- npm
- A TMDB API Read Access Token

## Setup

```bash
npm install
cp .env.example .env
```

Set `TMDB_READ_ACCESS_TOKEN` in `.env`, then start the service:

```bash
npm run dev
```

The API listens on `http://localhost:4000` by default.

## Configuration

| Name | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | HTTP port for the API. |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | Origin allowed by the CORS middleware. |
| `TMDB_READ_ACCESS_TOKEN` | Required | TMDB Read Access Token sent to TMDB as a Bearer token. |
| `TIMELINE_YEARS` | `6` | Positive integer number of current and previous UTC years returned by `GET /api/movies`. Invalid values fall back to `6`. |

Keep `.env` private. Do not send the TMDB token to browser code.

## Endpoints

### `GET /api/health`

Returns service status without making a TMDB request.

```json
{
  "status": "ok",
  "tmdbConfigured": true
}
```

### `GET /api/movies`

Returns movies for the configured recent-year timeline. The response is cached in memory for ten minutes.

Query parameters:

| Name | Values | Default |
| --- | --- | --- |
| `year` | An integer year used to filter the cached timeline | All configured timeline years |
| `sort` | `featured`, `rating`, `title` | `featured` |

```bash
curl "http://localhost:4000/api/movies?year=2025&sort=rating"
```

### `GET /api/movies/:year`

Fetches up to eight TMDB movies for one release year, ordered by TMDB popularity before local sorting. This endpoint is not cached.

- `year` must be an integer from `1800` through five years after the current UTC year.
- Optional `sort` accepts `featured`, `rating`, or `title`; other values use `featured`.

```bash
curl "http://localhost:4000/api/movies/2025?sort=title"
```

### `GET /api/movie/:id`

Fetches details for a single TMDB movie ID.

```bash
curl "http://localhost:4000/api/movie/550"
```

Successful movie endpoints return either a list or one movie under `data`:

```json
{
  "data": {
    "id": "550",
    "title": "Example title",
    "year": 2025,
    "releaseDate": "2025-01-01",
    "rating": 8.2,
    "genre": "Drama / Thriller",
    "synopsis": "Example synopsis.",
    "poster": "https://image.tmdb.org/t/p/w500/example.jpg",
    "rank": 1
  }
}
```

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid `:year` parameter. |
| `404` | Unknown route, or a movie response without a poster. |
| `502` | TMDB rejected a request or could not be reached. |
| `503` | `TMDB_READ_ACCESS_TOKEN` is missing. |

Errors use `{ "error": "..." }`.

## Implementation notes

- TMDB requests use a ten-second timeout and Bearer authentication.
- `GET /api/movies` obtains the genre map once and requests the configured years concurrently.
- A movie response includes no more than two genre names, a `w500` TMDB poster URL, and a fallback synopsis or genre when TMDB data is incomplete.
- CORS accepts only `FRONTEND_ORIGIN`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run `src/server.ts` in watch mode. |
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm run start` | Run the compiled server. |

## Vercel deployment

Deploy the `backend` directory as the Vercel project root. Vercel detects the default Express export in `src/app.ts`, so this project does not use a static output directory such as `public`.

Set `TMDB_READ_ACCESS_TOKEN` and the deployed frontend's URL for `FRONTEND_ORIGIN` in the Vercel project environment variables. Configure `NEXT_PUBLIC_API_URL` in the frontend deployment to the backend deployment URL.

## Verify

```bash
npm run build
```

For frontend configuration and workspace setup, see the [project README](../README.md).
