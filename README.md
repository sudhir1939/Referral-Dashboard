# Go Business — Referral Dashboard

A referral management dashboard built with React, React Router, and the Go Business referrals API. Partners can sign in, view earnings and overview metrics, share their referral link/code, and search, sort, and page through their referral history.

## Stack

- **React 19** + **Vite** for the app shell and dev/build tooling
- **react-router-dom** for routing (`BrowserRouter` lives in `App.jsx`; `main.jsx` only renders `<App />`)
- **js-cookie** for reading/writing the `jwt_token` auth cookie
- Plain CSS (`src/index.css`, `src/App.css`) — no UI framework

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` by default. Sign in with the test credentials below.

```bash
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

## Test credentials

```
Email:    admin@example.com
Password: admin123
```

## Project structure

```
src/
  api/client.js          All fetch calls: signIn, fetchDashboard, fetchReferralById
  components/
    Navbar.jsx            Brand + nav + logout, shown on protected pages
    Footer.jsx             Site footer
    ProtectedRoute.jsx     Redirects to /login when jwt_token cookie is missing
  pages/
    Login.jsx              /login
    Dashboard.jsx           /  — overview, service summary, share referral, referrals table
    ReferralDetail.jsx      /referral/:id
    NotFound.jsx            *  (public, not gated by ProtectedRoute)
  utils/format.js         formatDate (YYYY/MM/DD) and formatProfit (USD, no decimals)
  App.jsx                 Route table, wrapped in BrowserRouter
  main.jsx                Renders <App /> only
```

## How auth works

1. `POST /api/auth/signin` with `{ email, password }`.
2. On success, the JWT at `data.token` is stored via `Cookies.set('jwt_token', token)`.
3. Every subsequent referrals request reads the cookie back out and sends
   `Authorization: Bearer <jwt_token>`.
4. `ProtectedRoute` checks `Cookies.get('jwt_token')` before rendering `/` or
   `/referral/:id`, redirecting to `/login` if it's missing. Authenticated users
   visiting `/login` are redirected to `/`. The `*` (not found) route is never
   wrapped in `ProtectedRoute`, so it's reachable without a token.
5. **Log out** clears the cookie and navigates back to `/login`.

## Referrals API usage

All requests hit `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals`
with the bearer token from the cookie:

| Purpose | Query |
|---|---|
| Full list | *(none)* |
| Search | `?search=<term>` (also accepts `?q=`) |
| Sort | `?sort=asc` or `?sort=desc` (default `desc`) |
| Single referral | `?id=<id>` |

The API returns the **full** matching list for any search/sort combination —
pagination (10 rows/page) is handled entirely client-side in `Dashboard.jsx`.

The response parser in `api/client.js` accepts both documented shapes: fields
nested under `data` (`data.metrics`, `data.referrals`, …) and fields sitting
beside `data` at the top level. For a single-referral fetch, it also handles
the case where `data` *is* the row itself rather than an array entry.

## Notes on a few implementation choices

- **Search debounce**: typing in the referrals search box debounces ~350ms
  before firing the API call, to avoid a request per keystroke.
- **Error display**: a failed referrals fetch shows the API's message string
  together with the HTTP status code when available, in a `role="alert"`
  region.
- **Accessibility**: form labels are wired to inputs via `htmlFor`/`id`, the
  search input and major sections carry `aria-label`s, and the referrals
  table rows are keyboard-activatable (`Enter`/`Space`) in addition to
  clickable.

## Deployment

Deployed to Vercel as a static Vite build (`npm run build` → `dist/`). Because
this is a client-side-routed SPA, the Vercel project needs a rewrite so
deep links (e.g. `/referral/48`) resolve to `index.html`:

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
