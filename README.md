# JobXPortal
 
**One search. Every opening.**
 
JobXPortal is a live job aggregator built with React and Tailwind CSS. Instead of checking LinkedIn, Naukri, Foundit, Indeed and Wellfound separately, it pulls real, live job listings into a single board — searchable by title, skill, company and location.
 
The whole UI is built around a departures-board concept: job categories are shown as "gates," listings carry live status badges (NEW / LIVE / CLOSING SOON), and search results update automatically.
 
---
 
## Features
 
- **Live job search** — real listings fetched from the Adzuna Jobs API, not static mock data
- **Auto-refreshing board** — results refresh automatically every 5 minutes, with a manual refresh button and a "last updated" timestamp
- **Category browsing** — Frontend, Backend, Data, DevOps, Design, Remote, Mobile, AI/ML, QA, Security, Product, and Marketing
- **Filtering** — by date posted, job type (Full Time / Part Time / Contract), and remote-only
- **Company explorer** — groups current results by company with expandable job lists
- **Remote jobs page** — dedicated view for work-from-anywhere roles
- **Job details page** — full listing view with a direct apply link to the original posting
- **Login / Register pages** — boarding-pass themed auth UI (front-end only for now, no backend wired up yet)
- **Demo data fallback** — if the live API is unreachable or no API key is set, the site automatically falls back to local demo data instead of breaking
- **Fully responsive** — works on mobile, tablet and desktop, with a mobile nav menu
- **Scroll-to-top button** and automatic scroll reset on page navigation


## Author
 
**Anil Bhukya**
