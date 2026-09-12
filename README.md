# ALGERNON

Interactive narrative game inspired by Flowers for Algernon. Planning stage; gameplay implementation has not started.

## Development

Read AGENTS.md, TECH_SPEC.md, ROADMAP.md, and DECISIONS.md before editing. English voice with English and Simplified Chinese subtitles.

## Progress dashboard

Run `powershell -ExecutionPolicy Bypass -File .\start-dashboard.ps1` from the project directory, then open http://127.0.0.1:4174/project-status.html.

The launcher pins the document root to its own directory, avoiding 404 errors when a terminal starts elsewhere. The terminal must remain running. If port 4174 is already serving this project, use the existing service.

Edit project-status.json for progress. ASSET_MANIFEST.json records production assets. Never commit credentials or generated dependency folders.
