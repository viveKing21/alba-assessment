# Build Log: ReelTime

## Goal & scope decision
- Built an editorial movie timeline rather than a conventional catalogue grid. The timeline is the primary navigation and the newest seeded collection is the initial focus.

## Stack & tooling
- Next.js 16, React 19, and CSS for the client.
- Express 5 and TypeScript for the API.

## Key decisions & trade-offs
- The backend obtains real movie data from TMDB with a server-only Bearer token and ten-minute in-memory cache.
- The client shows an actionable configuration state instead of mock movies when the TMDB token is absent.

## Hard parts / dead ends
- Scroll focus uses `IntersectionObserver`, which is more stable than calculating scroll offsets across responsive card heights.

## How I verified it works
- Ran TypeScript compilation for the API and lint/build commands for the Next.js application.

## Known limitations
- A valid TMDB API Read Access Token is required for movie data. TMDB rate limits and terms of use apply.

## Time spent
- Initial implementation.
