# AGENTS.md

## Project Structure

```
Service-App/
├── frontend-services/    # React 17 + Vite - runs on port 5173
├── API Services/         # Express.js backend - runs on port 4040
└── .agents/skills/      # Available agent skills
```

## Running the Projects

- **Frontend**: `cd frontend-services && npm run dev`
- **Backend**: `cd "API Services" && npm run dev`

## Architecture Notes

- Backend uses **sql.js** (in-memory SQLite) - no separate database server required
- Backend runs on port **4040** (hardcoded in index.js)
- Frontend axios baseURL is `http://localhost:4040` in `src/config/axios.jsx`
- CORS whitelist includes: `localhost:3000`, `localhost:5173`, `192.168.1.80:3000`
- Pagination: 50 items per page, `/ingresos/count` endpoint returns total

## Tech Stack

- **Frontend**: React 17 + Vite (migrated from CRA), react-router-dom 5.2
- **Backend**: Express.js + sql.js (in-memory DB)
- **No TypeScript** - plain JavaScript/JSX

## File Extensions

- All React components use `.jsx` extension
- Entry point: `frontend-services/index.html` → `src/index.jsx`

## Available Skills

Use `.agents/skills/` for specialized guidance:
- **accessibility** - WCAG 2.2 audits and patterns
- **frontend-design** - Production-grade UI/UX
- **seo** - Search optimization

## Constraints

- No test scripts configured
- No lint/typecheck commands configured
- Legacy dependencies: axios 0.21.1