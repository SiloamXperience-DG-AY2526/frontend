# SiloamXperience Partner Management System — Frontend

Next.js 16 and React 19 web application for partners, volunteers, donors, and SiloamXperience staff. It connects to the [Express backend](https://github.com/SiloamXperience-DG-AY2526/backend).

The cross-repository implementation tracker is in the backend documentation: [February 2026 feature status](https://github.com/SiloamXperience-DG-AY2526/backend/blob/main/docs/FEB_2026_FEATURE_STATUS.md).

## Main user areas

- Partner sign-up, onboarding, login, profile, and password recovery
- Partner volunteer-project browsing, applications, proposals, contributions, and feedback
- Partner donation-project browsing, donation intentions, proposals, and history
- General-manager partner, volunteer-project, feedback, and email-campaign views
- Finance-manager donor, donation-project, dashboard, and email-template views
- Super-admin and sub-admin staff and management views

## Prerequisites

- Node.js 20
- npm
- A running backend API

## Local setup

1. Clone and enter the repository.

   ```bash
   git clone https://github.com/SiloamXperience-DG-AY2526/frontend.git
   cd frontend
   ```

2. Install the exact dependencies from `package-lock.json`.

   ```bash
   npm ci
   ```

3. Create the environment file.

   ```bash
   cp .env.example .env.local
   ```

4. Set both backend URLs. For local development, the Express API runs on port `3000`.

   ```env
   BACKEND_URL=http://localhost:3000/api/v1
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api/v1
   ```

5. Start Next.js on port `3001` so it does not conflict with the backend.

   ```bash
   npm run dev -- -p 3001
   ```

Open [http://localhost:3001](http://localhost:3001).

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `BACKEND_URL` | Next.js server and route handlers | Private server-side backend URL |
| `NEXT_PUBLIC_BACKEND_URL` | Browser code | Public backend URL used by client-side requests |

Keep `BACKEND_URL` server-only. Never put secrets in a variable prefixed with `NEXT_PUBLIC_`.

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev -- -p 3001` | Start the local application on port `3001` |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Apply safe ESLint fixes |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |

There is currently no automated frontend test command. At minimum, run lint and build, then manually check the role-specific flow affected by a change.

## Authentication flow

1. The browser calls a Next.js route under `src/app/api/auth/`.
2. The route forwards the request to the Express backend.
3. The returned access token is stored in the `access_token` cookie.
4. Layouts and API routes use that cookie for role checks and authenticated backend requests.
5. Staff accounts with `mustChangePassword` are sent to `/update-password` before their normal dashboard.

Role home pages are mapped in `src/lib/homeRoutes.ts`.

## Project structure

```text
src/
  app/
    (auth)/            login, sign-up, onboarding, password flows
    (partner)/         partner volunteer and donation journeys
    (generalManager)/  general-manager pages
    (financeManager)/  finance-manager pages
    (superAdmin)/      super-admin pages
    (subAdmin)/        sub-admin pages
    api/               Next.js route handlers that proxy the backend
  components/          shared and role-specific UI
  contexts/            authentication context
  hooks/               reusable data-loading hooks
  lib/api/             frontend API clients
  types/               shared TypeScript types and Zod schemas
public/assets/         local images and static assets
```

Folders in parentheses are Next.js route groups and do not appear in the URL. For example, `src/app/(financeManager)/finance-manager/home/page.tsx` is served at `/finance-manager/home`.

## Adding or changing an API integration

1. Confirm the backend route and response shape.
2. Add or update the appropriate Next.js handler under `src/app/api/` when the request needs the auth cookie or server-only backend URL.
3. Keep request helpers in `src/lib/api/` and shared shapes in `src/types/`.
4. Handle loading, empty, unauthorized, and error states in the page.
5. Run:

   ```bash
   npm run lint
   npm run build
   ```

6. Manually test the affected role and the unauthorized case.

## Before opening a pull request

- Create or reference a GitHub issue.
- Use `Fixes #<issue-number>` in the PR description when merging should close it.
- Run `npm run lint` and `npm run build`.
- Check the desktop and narrow/mobile layout.
- Verify that no credentials, test tokens, or personal data are included.

## Known handover cautions

- The donation confirmation screen still uses a simulated random success/failure result and shows “Donation Successful”; [frontend issue #48](https://github.com/SiloamXperience-DG-AY2526/frontend/issues/48) remains open.
- Several partner donation screens explicitly format amounts as SGD even though the agreed product currency is USD.
- File/image proposal fields still contain temporary placeholders until storage integration is completed.
- Review `src/contexts/AuthContext.tsx` before deployment: it currently injects a temporary hard-coded JWT into the auth cookie and must be cleaned up.
