# BloodMatch — Blood Donor Match Finder

A premium, front-end prototype of a real-time blood donor matching platform. Built with **React 18 + Vite + Tailwind CSS**, using `lucide-react` for icons and `recharts` for analytics charts.

> **Note:** This is a UI/UX prototype. It uses mock data and simulated matching logic — there is no real backend, database, authentication, SMS/OTP, or live geolocation matching wired up. See "Turning this into a real product" below for what that would take.

## What's included

- **Landing page** — hero, live stats, how-it-works, role selector
- **Role-based login screen** — Patient / Donor / Hospital / Blood Bank / Admin, email or phone-OTP UI, Google button (UI only)
- **Patient dashboard** — emergency request wizard, live donor matching simulation, request history, emergency contacts
- **Donor dashboard** — availability toggle, incoming request alerts (accept/decline), donation history, eligibility profile
- **Hospital dashboard** — request queue, nearby donors, blood inventory with low-stock indicators, analytics charts
- **Admin dashboard** — network KPIs, trend charts, user & hospital management tables

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Visit the URL Vite prints (default `http://localhost:5173`).

### 3. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder. Preview it locally with:

```bash
npm run preview
```

## Deploying to Vercel

**Option A — Vercel CLI**

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Vite projects (build command `npm run build`, output directory `dist`).

**Option B — Git + Vercel dashboard**

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Click **Deploy**.

No environment variables are required for the current mock-data version.

## Project structure

```
bloodmatch-app/
├── index.html              # Vite entry HTML
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx             # React root
    ├── index.css            # Tailwind directives
    └── App.jsx               # Entire application (landing, auth, all 4 dashboards)
```

`App.jsx` is intentionally a single file containing all screens and components (design tokens, mock data, shared UI primitives, and the four role dashboards) to make it easy to read top-to-bottom. Feel free to split it into `src/components/`, `src/pages/`, and `src/data/` as the app grows.

## Turning this into a real product

To go from prototype to production you'd need to add:

- **Backend & database** — e.g. Node/Express or a BaaS like Supabase/Firebase, with tables for users, donors, requests, hospitals, and blood inventory.
- **Authentication** — real JWT-based auth, Google OAuth, and phone OTP via a provider like Twilio Verify or Firebase Auth.
- **Geolocation & matching engine** — browser Geolocation API + a maps provider (Google Maps/Mapbox) for real GPS pins, distance calculation (e.g. PostGIS or a geospatial index), and a compatibility + proximity ranking algorithm.
- **Real-time updates** — WebSockets (e.g. Socket.IO, Supabase Realtime, or Pusher) so donor matches and request status update live instead of via simulated timers.
- **Notifications** — push notifications (FCM/APNs) and SMS (Twilio) to alert nearby donors instantly.
- **Role-based access control** — server-side enforcement of what each role (patient/donor/hospital/blood bank/admin) can see and do.

## Tech stack

| Layer      | Choice                          |
|------------|----------------------------------|
| Framework  | React 18                         |
| Bundler    | Vite 5                           |
| Styling    | Tailwind CSS 3 + custom CSS tokens |
| Icons      | lucide-react                     |
| Charts     | recharts                         |

## License

This prototype is provided as-is for demonstration purposes.
