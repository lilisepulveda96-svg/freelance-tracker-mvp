# Freelance Tracker — Frontend

Built with **React + Vite + TypeScript** on top of **React Admin**, a framework
that provides an enterprise-grade CRUD system out of the box. The key architectural
decision was adapting React Admin's native provider pattern to communicate with a
custom Node.js/Express API instead of a generic REST adapter.

---

## 🏗️ Architecture Decision: Why React Admin?

Most junior developers build CRUD interfaces manually — form state, fetch calls,
error handling, pagination, sorting. React Admin abstracts all of that into a
declarative `<Resource>` component, allowing the focus to shift to **business logic
and UX** instead of boilerplate.

The tradeoff: React Admin expects a specific data contract. This project implements
two custom providers to bridge that gap:

| Provider          | Responsibility                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `authProvider.ts` | Maps Supabase Auth to React Admin's auth lifecycle: login, logout, session validation, error handling and user identity. |
| `dataProvider.ts` | Translates React Admin's CRUD methods to the Node.js REST API with automatic JWT injection                               |

---

## 📁 Project Structure

```
src/

├── config/

│   ├── axiosClient.ts        # Axios instance with JWT interceptor

│   └── supabaseClient.ts     # Public Supabase client for Auth (anon key only)

├── pages/

│   └── dashboard-metrics/

│       └── Dashboard.tsx     # KPI dashboard with Recharts bar chart

├── providers/                # The bridge between React Admin and the backend

│   ├── authProvider.ts       # Supabase Auth → React Admin auth contract

│   └── dataProvider.ts       # REST API → React Admin data contract

├── resources/                # Declarative CRUD modules

│   ├── customers/            # CustomerCreate, CustomerEdit, CustomerList

│   ├── projects/             # ProjectCreate, ProjectEdit, ProjectList

│   └── time-logs/            # Custom time tracking module

│       ├── hooks/

│       │   └── useTimer.ts   # Isolated hook for real-time timer logic

│       └── TrackerPage.tsx   # Custom page consuming useTimer


├── theme/

│   └── theme.ts              # MUI light/dark theme injected into <Admin>

├── types/
│   └── vite-env.d.ts         # Vite environment variable type declarations

├── App.tsx                   # Central <Admin> component with <Resource> registration

└── main.tsx                  # Application entry point — mounts React tree into
```

---

## 🔐 Authentication Flow

Supabase Auth handles identity. The `authProvider` maps its methods to React Admin's
expected contract:

```
User submits login form

→ authProvider.login() → supabaseClient.auth.signInWithPassword()

→ authProvider.checkAuth() → supabaseClient.auth.getUser() [server-side validation]

→ React Admin grants access

```

Key decision: `checkAuth` uses `getUser()` instead of `getSession()` — the former
validates the token server-side, avoiding false positives with expired tokens stored
in localStorage.

---

## 🔄 Data Flow

All CRUD operations go through the `dataProvider` — no manual fetch calls in
resource components. Custom pages like the Dashboard that fall outside the CRUD
pattern call `axiosClient` directly, which still benefits from the automatic
JWT interceptor.

**CRUD resources:**

```
React Admin <List> mounts

→ dataProvider.getList('customers', { pagination, sort })

→ axiosClient.get('/customers?\_start=0&\_end=10')

→ JWT injected automatically via axios interceptor

→ Backend returns data + Content-Range header

→ dataProvider parses Content-Range for pagination total

→ React Admin renders <Datagrid> with data
```

**Custom pages:**

```
Dashboard mounts
  → axiosClient.get('/dashboard-metrics')
  → JWT injected automatically via axios interceptor
  → Backend returns: totalHours, projectedRevenue, totalCustomers,
    hoursByProject, completedPercentage, totalProjects, completedProjects
  → Component renders KPI cards and Recharts bar chart
```

---

## ⏱️ Custom Time Tracker

The timer module is the most technically complex part of the frontend. It doesn't
fit the CRUD pattern, so it uses a custom architecture:

- **`useTimer.ts`** — isolated hook managing multiple simultaneous timers per
  `project_id`. Uses timestamps instead of counters for precision — the timer stays
  accurate even if the browser tab loses focus or freezes.
- **`TrackerPage.tsx`** — purely declarative component consuming `useTimer`.
  On stop, it calls `dataProvider.create('time-logs')` to persist the log.
- **localStorage persistence** — active timers survive page refreshes.

---

## 🎨 Theme

A custom MUI theme (`lightTheme` + `darkTheme`) is injected into `<Admin>` via the
`lightTheme` and `darkTheme` props, replacing React Admin's default grey palette with
a professional blue/amber color system. React Admin handles the toggle automatically.

Key overrides: `MuiButton`, `MuiCard`, `MuiChip`, `MuiDrawer` (dark sidebar),
`MuiTableCell` (custom header styling), `MuiAppBar`.

---

## 🚀 Getting Started

```bash
# Install dependencies
cd frontend
npm install

# Configure environment
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_URL

# Start development server
npm run dev
```

---

## 🔑 Environment Variables

| Variable                 | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL                           |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key (safe to expose)           |
| `VITE_API_URL`           | Backend API base URL (e.g. `http://localhost:3000`) |

---

## 📦 Key Dependencies

| Package                 | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `react-admin`           | CRUD framework with built-in pagination, sorting, filtering |
| `@mui/material`         | Component library and theming system                        |
| `@supabase/supabase-js` | Auth client                                                 |
| `axios`                 | HTTP client with interceptor support                        |
| `recharts`              | Chart library for the dashboard                             |

---

## 🚀 Roadmap

- [ ] Task management within projects
- [ ] Historical month selector in dashboard
- [ ] Time breakdown by task
- [ ] OAuth login (Google, GitHub)
