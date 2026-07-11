# Build Log: ReelTime

## Goal & Scope Decision

I wanted to build a movie discovery experience that felt different from the typical "search and browse" application. Instead of leading with endless grids of posters, I designed ReelTime as an editorial timeline where users can explore cinema year by year.

To stay within the 2–4 hour time box, I intentionally focused on creating a polished experience with smooth interactions, responsive design, loading/error states, and a backend that securely proxies TMDB requests. Features such as user accounts, favorites, reviews, and watchlists were deliberately left out so I could spend more time improving the overall product quality.

---

## Stack & Tooling

### Technologies

* Next.js 16 (App Router)
* React 19
* TypeScript
* Express 5
* TMDB API
* Vercel (deployment)

### AI Tools Used

I used AI throughout the project as part of my normal development workflow.

* **ChatGPT** – brainstorming ideas, refining the project concept, discussing architecture, reviewing documentation, and improving UX decisions.
* **OpenCode + OpenAI models** – generating implementation scaffolding, frontend components, backend endpoints, and iterative refactoring.
* **Gemini** – used selectively for alternative implementation ideas and UI refinements.

All generated code was reviewed, tested, and modified before being included in the final submission.

---

## Key Decisions & Trade-offs

* Chose an editorial timeline instead of a traditional movie catalogue to create a more distinctive browsing experience.
* Built a backend-for-frontend using Express so the TMDB Read Access Token remains server-side and is never exposed to the client.
* Added server-side caching to reduce unnecessary requests and help mitigate TMDB rate limits.
* Implemented dedicated loading, empty, and error states instead of relying on simple spinners.
* Prioritized polish, responsiveness, and overall user experience over adding additional features within the available time.
* Kept the backend intentionally lightweight since this assignment focuses primarily on frontend product quality rather than complex backend architecture.

---

## Hard Parts / Dead Ends

* Initially explored several different project ideas before settling on the timeline concept, as I wanted something that felt unique rather than another movie search application.
* Deploying the project to Vercel took significantly longer than expected. The initial deployment failed due to configuration issues, and resolving the build and deployment errors required several iterations. After multiple fixes and redeployments, the application was successfully deployed.
* Refining the UI was highly iterative. Several layouts and visual styles were generated and refined with AI before arriving at the final design.
* Scroll behavior for timeline navigation was more reliable using `IntersectionObserver` than manually calculating scroll offsets across responsive layouts.

---

## How I Verified It Works

* Tested the application on desktop and mobile screen sizes.
* Verified loading, empty, and error states.
* Confirmed the application behaves correctly when the TMDB token is missing or invalid.
* Tested API requests through the backend to ensure credentials remain server-side.
* Verified caching behavior during repeated requests.
* Ran production builds and linting before deployment.
* Performed end-to-end testing using the deployed Vercel application.

---

## Known Limitations

* Requires a valid TMDB Read Access Token.
* The current cache is in-memory and resets whenever the backend restarts.
* The timeline currently focuses on the implemented browsing experience rather than providing exhaustive historical analytics.
* Due to the assessment time constraints, automated tests were not implemented.
* Additional filtering, search options, and richer historical insights would be added with more development time.

---

## Time Spent

| Phase                                                           | Approximate Time |
| --------------------------------------------------------------- | ---------------: |
| Brainstorming concepts and discussing approaches with AI        |       20 minutes |
| Creating an initial UI direction in Figma                       |    15–20 minutes |
| Project setup and initial architecture                          |    20–25 minutes |
| Building the frontend, backend, and iterating on the UI with AI |          ~1 hour |
| Deployment, debugging, and fixing Vercel build issues           |    50–60 minutes |

**Total:** Approximately **3 hours**.
