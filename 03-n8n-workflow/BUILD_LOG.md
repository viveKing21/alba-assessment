# Build Log: Job Finder & Daily Digest

## Goal & scope decision
- Built an n8n workflow that discovers remote developer jobs, filters for React/Next.js-related roles, records matches in Google Sheets, and emails an AI-generated digest.
- Kept the workflow focused on one external job source (Remotive) and title-based keyword matching so it could be completed and configured quickly.
- Deliberately left out multi-source aggregation, duplicate detection, advanced ranking, and a custom UI.

## Stack & tooling
- **n8n**: Orchestrates the schedule, HTTP request, filtering, Google Sheets update, LLM generation, and Gmail delivery without custom infrastructure.
- **Remotive API**: Provides the remote job listings consumed by the workflow.
- **JavaScript Code nodes**: Normalize the API response and filter jobs using relevant developer keywords.
- **Google Sheets OAuth2**: Stores matching jobs in a simple, editable tracking sheet.
- **Gmail OAuth2**: Sends either the generated job digest or the no-results notification.
- **OpenAI / `gpt-4o-mini`**: Produces a readable HTML email with summaries and top job recommendations.

## Key decisions & trade-offs
- Decision: Use a scheduled n8n workflow because it provides a fast, visual automation path with built-in integrations (alternative considered: a custom cron-based application).
- Decision: Use the Remotive API because it is directly accessible through an HTTP Request node and returns structured job data (alternative considered: scraping multiple job boards).
- Decision: Filter title text with a short keyword list because it is transparent and easy to tune (alternative considered: LLM-based relevance scoring).
- Decision: Append all matches to Google Sheets because it creates a simple audit trail with no database setup (alternative considered: a dedicated database with deduplication).
- Decision: Use an LLM to format the email because it produces more useful summaries than a static template (alternative considered: a fixed HTML template with raw job fields).
- Decision: Send a no-results email so scheduled runs are visible even when no jobs match (alternative considered: silently ending the workflow).

## Hard parts / dead ends
- The workflow needs multiple external credentials. Each imported workflow must be reconnected to Gmail, Google Sheets, and the LLM provider because n8n credential IDs are instance-specific and are not portable.
- The LLM output must be valid email HTML rather than Markdown. The prompt explicitly requests HTML-only output to make the Gmail message render correctly.
- Job API results require normalization before writing to Sheets. A JavaScript node maps the source fields to stable sheet columns.

## How I verified it works
- Confirmed the workflow has a complete path from schedule trigger through the Remotive request, normalization, filtering, conditional branch, sheet append, LLM chain, and Gmail delivery.
- Confirmed the matching-job branch appends `title`, `company`, `location`, `category`, `url`, and `published` values to Google Sheets.
- Confirmed the no-match branch sends a separate plain-text Gmail message.
- Reviewed the included workflow, Google Sheet, and email screenshots.
- With more time, I would execute end-to-end tests using dedicated test credentials, test an empty API result, and add duplicate prevention across scheduled runs.

## Known limitations
- Filtering only checks job titles, so relevant roles with different titles may be missed and unrelated roles may be included.
- The workflow does not deduplicate jobs before appending them to Google Sheets.
- It relies on the availability and response format of the Remotive API.
- The email subject calls the result a daily digest, while the current schedule runs at minute 1 of every hour.
- The workflow contains recipient, spreadsheet, and credential selections that must be changed after import.

## Time spent
- Total: approximately 1.5 hours.
- Brainstorming ideas with AI and choosing the workflow: approximately 20 minutes.
- Setting up an n8n account and exploring workflow creation: approximately 20 minutes.
- Building the workflow and testing each node execution: approximately 30-40 minutes.
- Final testing and setup: approximately 20 minutes.
