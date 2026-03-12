# Gratitude Journal

A personal gratitude journal web app built with Django, React, and TypeScript. Made as a take-home assignment.

Users write a daily entry, browse past entries by month, and view a streak count and activity chart over time.

## Tech stack

- **Backend:** Django 6, Django REST Framework, SQLite
- **Frontend:** React 18, TypeScript, Vite, Recharts, i18next, Playwright

## Requirements

- Python 3.11+
- Node 20+

## Running locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

Optionally, seed the database with sample entries (venv must be active):

```bash
python manage.py seed_data
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Running tests

With both servers running, from the `frontend` directory:

```bash
npx playwright test
```

On Ubuntu-based distros, install Playwright's managed browsers first:

```bash
npx playwright install chromium firefox
```

On other distros (Arch, Fedora, etc.), the config attempts to use system-installed Chromium and Firefox. Install both via your package manager before running tests.

Note: the tests include visual snapshot comparisons, which can be flaky across different hardware and OS configurations due to rendering differences. Run `npx playwright test --update-snapshots` to generate fresh local baselines on first run.

## Project structure

```
backend/
  config/        Django project settings and URL config
  journal/       App: models, serializers, views, URLs
    management/
      commands/  Custom management commands (seed_data)

frontend/
  src/
    api/         Typed fetch wrappers for all API calls
    hooks/       Custom React hooks (useEntries, useStats)
    locales/     i18n translation files (en, fi)
    pages/       Page components (Today, Journal, Stats)
    types/       Shared TypeScript interfaces
  tests/         Playwright end-to-end tests
```

## Design decisions

Authentication is intentionally omitted. This is a single-user local app and adding auth would add setup friction without demonstrating anything beyond what a very basic Django tutorial covers.

The frontend is more built out than the backend. Having more existing experience with Django, I felt getting refreshed on React was the more useful focus.

## API endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET / POST | `/api/entries/` | List (supports `?year=&month=`) / create |
| GET / PUT / DELETE | `/api/entries/{id}/` | Retrieve, update, delete |
| GET | `/api/stats/` | Streak counts and entries per month |
