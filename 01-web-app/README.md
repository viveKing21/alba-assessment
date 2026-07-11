# Reeltime

Reeltime is an editorial movie discovery experience built around a living timeline. Readers browse annual movie selections, change their ordering, open a full yearly collection, and view individual movie details.

## Highlights

- Scroll-aware timeline navigation with direct year jumps.
- Current-year-first movie collections, with four featured cards and an expandable full collection.
- User-selectable ordering by editorial rank, rating, or title.
- Responsive desktop rail and compact mobile year strip.
- Express API with CORS, a health check, sortable yearly data, movie details, and a TMDB integration.
- Real movie titles, release data, ratings, genres, overviews, and posters from TMDB.

## Project structure

```text
01-web-app/
├── backend/                 # Express 5 + TypeScript API
│   ├── src/server.ts        # Routes, TMDB client, caching, and response mapping
│   └── README.md            # API-specific setup and endpoint reference
├── frontend/                # Next.js 16 App Router application
│   ├── app/reeltime.tsx     # Timeline interaction and presentation
│   ├── app/movie/[id]/      # Movie detail route
│   └── README.md            # Frontend-specific setup and behavior
├── BUILD_LOG.md             # Implementation notes
└── README.md                # This guide
```

## Requirements

- Node.js 20 or later
- npm
- A TMDB API Read Access Token

## Run locally

Install and start the API:

```bash
cd 01-web-app/backend
npm install
cp .env.example .env
# Add your TMDB_READ_ACCESS_TOKEN to .env.
npm run dev
```

In a second terminal:

```bash
cd 01-web-app/frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The API runs at `http://localhost:4000` by default.

## Environment variables

Backend (`backend/.env`):

| Name | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | Port used by the Express server. |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | Allowed CORS origin for the web client. |
| `TMDB_READ_ACCESS_TOKEN` | Required | TMDB API Read Access Token, sent to TMDB as a server-side Bearer token. Do not expose it to the frontend. |
| `TIMELINE_YEARS` | `6` | Number of years, starting with the current UTC year, included by `GET /api/movies`. |

Frontend (`frontend/.env.local`):

| Name | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL used to request Reeltime movie data. |

Example files are committed at `backend/.env.example` and `frontend/.env.example`. Local environment files are ignored by Git.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Returns the service status and whether TMDB credentials are configured. |
| `GET` | `/api/movies` | Returns movies for the configured number of recent UTC years. Accepts optional `year` and `sort` query parameters. |
| `GET` | `/api/movies/:year` | Returns a single release year's movie collection. Accepts optional `sort`. |
| `GET` | `/api/movie/:id` | Returns details for one TMDB movie ID. |

Movie records are fetched from TMDB, normalized for the client, and returned as `{ "data": [...] }`. Each record includes a title, release date, genre, rating, synopsis, poster URL, and popularity rank. The aggregated `GET /api/movies` response is cached in memory for ten minutes; direct per-year and detail requests are fetched from TMDB per request.

See [`backend/README.md`](./backend/README.md) for request examples, validation rules, error responses, and API implementation notes.

## Application behavior

- The timeline shows every year from the current UTC year back to 1900 and loads each year's movie collection when its section enters the viewport.
- `IntersectionObserver` keeps the active navigation year in sync with the most visible section.
- The selected sort is stored in the `sort` query parameter and is applied when yearly data is requested.
- Opening a movie preserves the timeline's scroll position when returning through the in-app back link.
- Images are optimized through `next/image`; `image.tmdb.org` is the configured remote source.

## Verification

```bash
cd 01-web-app/backend && npm run build
cd 01-web-app/frontend && npm run lint && npm run build
```

## Data attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. Review TMDB's terms of use before deploying the application.
