# Reeltime Frontend

The Reeltime frontend is a Next.js 16 and React 19 application for browsing an editorial movie timeline backed by the local Express API.

## Requirements

- Node.js 20 or later
- npm
- A running Reeltime backend. See [`../backend/README.md`](../backend/README.md).

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server is available at `http://localhost:3000`.

## Configuration

Create `frontend/.env.local` from the provided example:

| Name | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | Base URL for Reeltime API requests. |

Only the API base URL is exposed to the browser. TMDB credentials belong in the backend environment file, never in a `NEXT_PUBLIC_*` variable.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Scrollable yearly movie timeline. The optional `sort` query parameter accepts `featured`, `rating`, or `title`. |
| `/movie/:id` | Movie detail page for a TMDB movie ID. It retains the selected sort and supports returning to the previous timeline position. |

## Behavior

- Years run from the current UTC year through 1900, newest first.
- Year sections request `GET /api/movies/:year` only after entering the viewport.
- `IntersectionObserver` drives the active year in the desktop timeline rail and mobile year navigation.
- The page displays four movies for each year and opens the remaining loaded movies in a modal collection.
- Movie posters use `next/image` with `image.tmdb.org` allowed in `next.config.ts`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after building. |
| `npm run lint` | Run ESLint. |

## Verify

```bash
npm run lint
npm run build
```

For workspace-wide setup and API details, see the [project README](../README.md).
