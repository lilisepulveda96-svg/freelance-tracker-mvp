# Freelance Tracker — Backend

Built with **Node.js + Express + TypeScript** in strict mode. The backend acts as a
secure intermediary between the React Admin frontend and Supabase — validating every
request before it reaches the database, enforcing data ownership via `user_id`
filtering, and returning responses in the exact format React Admin expects.

---

## 🏗️ Architecture Decision: Why a Custom Backend Instead of Supabase Directly?

Supabase exposes a REST API that could be called directly from the frontend. The
deliberate choice to add a Node.js layer provides:

| Benefit                        | Implementation                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Centralized JWT validation** | `auth.middleware.ts` validates every token server-side before any business logic runs                    |
| **Input validation**           | `validate.middleware.ts` intercepts `req.body` with Zod schemas before hitting the database              |
| **React Admin protocol**       | Controllers inject the `Content-Range` header required by React Admin's automatic pagination             |
| **Business logic isolation**   | Revenue calculations, metric aggregations and data transformations live in the backend, not the frontend |

---

## 📁 Project Structure

```
src/

├── config/

│   └── supabase.ts               # Supabase Admin client (Service Role Key)

│                                 # autoRefreshToken: false, persistSession: false

├── middlewares/

│   ├── auth.middleware.ts        # JWT validation via supabaseAdmin.auth.getUser()

│   │                             # Injects validated user into req.user

│   └── validate.middleware.ts    # Generic Zod middleware — validates req.body

│                                 # Returns 400 with field-level errors on failure

├── modules/                      # Clean separation by business entity

│   ├── customers/

│   │   ├── customers.controller.ts # CRUD handlers with Content-Range on GET

│   │   ├── customers.routes.ts   # Routes protected with authMiddleware

│   │   └── customers.schema.ts   # Zod schemas: createCustomerSchema, updateCustomerSchema

│   ├── dashboard/

│   │    ├── dashboard.controller.ts # 3 parallel queries via Promise.all

│   │   └── dashboard.routes.ts

│   ├── projects/

│   │   ├── projects.controller.ts

│   │   ├── projects.routes.ts

│   │   └── projects.schema.ts    # Enum validation for status field

│   └── time-logs/

│      ├── time-logs.controller.ts

│      ├── time-logs.routes.ts

│      └── time-logs.schema.ts

│

├── types/

│   └── index.ts                  # Express Request type extension with req.user

├── app.ts                        # Express setup: CORS, JSON parser, route registration

└── server.ts                     # Server entry point — loads env before any module
```

---

## 🔐 Security Model

Every request goes through two middleware layers before reaching any controller:

```
Incoming request

→ auth.middleware.ts

→ Extracts Bearer token from Authorization header

→ supabaseAdmin.auth.getUser(token) [server-side validation]

→ Injects { id, email, role } into req.user

→ Returns 401 if token is missing, invalid or expired

→ validate.middleware.ts (POST/PUT only)

→ Zod schema validates req.body

→ Returns 400 with field-level errors on failure

→ Controller

→ All queries filter by req.user.id — users can only access their own data
```

Even with a valid token, a user cannot access another user's data — every Supabase
query includes `.eq("user_id", req.user.id)` as a hard filter, reinforced by
Row Level Security policies at the database level.

---

## 📡 React Admin Protocol: Content-Range Header

React Admin requires a `Content-Range` header on every `GET` list response to
calculate pagination automatically. Without it, the frontend throws an error.

Every list controller follows this pattern:

```typescript
const { data, count } = await supabaseAdmin
  .from("customers")
  .select("*", { count: "exact" })
  .eq("user_id", userId)
  .range(start, end - 1);

res.setHeader("Content-Range", `customers ${start}-${end - 1}/${count}`);
res.json(data);
```

The `count: "exact"` option triggers a `COUNT(*)` in PostgreSQL — necessary for
React Admin to know the total number of pages.

---

## 📊 Dashboard Metrics Endpoint

The `/dashboard-metrics` endpoint is the most complex in the backend. It runs
3 independent queries in parallel and aggregates the results in memory:

```
GET /dashboard-metrics

├── Query 1: time_logs of current month joined with projects (for hours + revenue)

├── Query 2: COUNT(*) of customers (head: true — no rows fetched)

└── Query 3: projects status list (for completion percentage)

↓

Calculated in JS:

totalHours: sum of duration_seconds / 3600
projectedRevenue: sum of (duration_seconds / 3600) * hourly_rate per project
hoursByProject: grouped and sorted by hours descending
completedPercentage: completedProjects / totalProjects * 100
```

`Promise.all` ensures all 3 queries run simultaneously — total response time equals
the slowest query, not the sum of all three.

---

## 🚀 Getting Started

```bash
# Install dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FRONTEND_URL

# Start development server
npm run dev
```

---

## 🔑 Environment Variables

| Variable                    | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `SUPABASE_URL`              | Your Supabase project URL                            |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key — never expose this in the frontend |
| `FRONTEND_URL`              | Allowed CORS origin (e.g. `http://localhost:5173`)   |
| `PORT`                      | Server port (default: 3000)                          |

---

## 📦 Key Dependencies

| Package                 | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `express`               | HTTP server and routing                                 |
| `@supabase/supabase-js` | Admin client for database operations and JWT validation |
| `zod`                   | Schema validation for request bodies                    |
| `dotenv`                | Environment variable loading                            |
| `tsx`                   | TypeScript execution for development                    |
