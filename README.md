# ALBA CORP – Engineering Assessment

This repository contains my submission for the **ALBA CORP Engineering Assessment**.

The assessment consists of three independent projects that demonstrate different aspects of modern software development: frontend product development, backend/data-driven applications, and workflow automation.

---

## Projects

| Project               | Description                                                                                                                                       | Live Demo                                        | Walkthrough                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| **01 – ReelTime**     | A cinematic movie discovery experience built around an interactive timeline using the TMDB API.                                                   | https://reeltime-app-amber.vercel.app/           | https://www.loom.com/share/32748807be464b62a758ccc591ea2d37                      |
| **02 – ProjectPulse** | A modern project management dashboard powered by Supabase with authentication, CRUD operations, charts, Row-Level Security, and realtime updates. | https://project-pulse-brown.vercel.app/dashboard | https://www.loom.com/share/cbc11384f5824094997625b44f5a44cd |
| **03 – n8n Workflow** | An automated remote-job finder that tracks React/Next.js roles in Google Sheets and emails an AI-generated digest.                                | No live URL (import into n8n)                    | https://www.loom.com/share/c2423264a988480d92b0cc48306b83f8 |

---

## Repository Structure

```text
.
├── 01-web-app/
│   ├── README.md
│   ├── BUILD_LOG.md
│   └── ...
│
├── 02-dashboard/
│   ├── README.md
│   ├── BUILD_LOG.md
│   └── ...
│
└── 03-n8n-workflow/
    ├── README.md
    ├── BUILD_LOG.md
    └── workflow.json
```

Each project is completely self-contained and includes:

* Project-specific README
* BUILD_LOG.md documenting my development process
* Environment variable template (`.env.example`)
* Setup instructions
* Deployment or import instructions

---

# Project Highlights

## 01 – ReelTime

**ReelTime** is a polished movie discovery application that explores cinema through time rather than presenting a conventional movie catalogue.

### Highlights

* Timeline-based movie discovery
* TMDB API integration
* Server-side API proxy
* Responsive UI
* Loading, empty, and error states
* Skeleton loading
* Backend caching
* Modern animations
* Production deployment

---

## 02 – ProjectPulse

**ProjectPulse** is a project management dashboard designed around modern SaaS principles.

### Highlights

* Supabase Authentication
* Full CRUD
* Row-Level Security (RLS)
* Realtime updates
* Project & Task management
* Dashboard analytics
* Responsive UI
* Production-ready deployment

---

## 03 – Job Finder & Daily Digest

**Job Finder & Daily Digest** is an n8n automation that monitors remote job listings, identifies React/Next.js-relevant roles, and delivers a curated email summary.

### Highlights

* Scheduled remote-job collection through the Remotive API
* JavaScript keyword filtering for React, Next.js, TypeScript, Node.js, and frontend roles
* Google Sheets logging for matched jobs
* AI-generated HTML email digest with job summaries and recommendations
* Gmail notifications for both matching and no-match runs
* Importable n8n workflow with setup documentation
* [Watch the walkthrough](https://www.loom.com/share/c2423264a988480d92b0cc48306b83f8)

This project does not have a public live URL. Import [`03-n8n-workflow/workflow.json`](03-n8n-workflow/workflow.json) into an n8n instance, then configure Gmail, Google Sheets, and LLM credentials to run it.

---

## Technologies Used

Across the projects I used:

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Supabase
* Express
* Recharts
* React Hook Form
* Zod
* shadcn/ui
* TMDB API
* Vercel
* n8n
* Google Sheets API
* Gmail API
* OpenAI API

---

## AI-Assisted Development

Following the assessment guidelines, AI tools were used throughout the development process as part of a modern engineering workflow.

These included:

* ChatGPT
* OpenAI models
* Gemini
* OpenCode

AI was used for brainstorming, architecture discussions, implementation assistance, UI refinement, debugging, documentation, and code review. All generated code was reviewed, tested, and understood before submission.

---

## Documentation

Each project contains its own documentation, including:

* Project overview
* Feature list
* Architecture overview
* Setup instructions
* Environment configuration
* Build log
* Technical decisions
* Known limitations
* Future improvements

---

## Notes

* No production secrets or credentials are committed.
* Environment variables are documented using `.env.example`.
* Each project can be reviewed independently. The n8n workflow is imported and configured in an n8n instance rather than deployed to a public URL.
* Build logs document the development process, architectural decisions, trade-offs, and verification steps.

Thank you for taking the time to review my submission.
