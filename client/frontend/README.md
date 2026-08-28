# EcoCycle — E-Waste Management System (Frontend)

A production-quality React frontend for the EcoCycle e-waste management backend, covering
three roles — Customer, Collector, and Admin — with full API coverage, role-based routing,
and a premium environmental SaaS design.

## Tech Stack

- React 18 + Vite (JavaScript, no TypeScript)
- React Router DOM v6
- Axios (with JWT interceptors)
- Bootstrap 5 + Bootstrap Icons
- Chart.js + react-chartjs-2 (Admin dashboard analytics)
- Custom CSS design system (`src/styles/theme.css`) — no reliance on default Bootstrap look

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the backend URL**

   A `.env` file is already included:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Update this if your backend runs elsewhere.

3. **Start your backend**

   Make sure the Node/Express/MySQL backend is running on `http://localhost:5000`
   (or whatever you set `VITE_API_URL` to).

4. **Run the frontend**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

5. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
src/
├── api/            Axios instance + one module per backend domain
├── components/      Reusable UI: layout, navbar, sidebar, cards, tables,
│                     forms, modals, badges, loaders, common
├── context/          AuthContext (JWT/session) and ToastContext
├── hooks/            useAuth, useToast, usePagination
├── pages/            public, auth, customer, collector, admin pages
├── routes/           ProtectedRoute (auth) and RoleRoute (role-based)
├── utils/            format.js, validators.js
├── App.jsx           All application routes
└── main.jsx          Entry point
```

## Roles & Routes

| Role      | Dashboard route          |
|-----------|---------------------------|
| Customer  | `/customer/dashboard`     |
| Collector | `/collector/dashboard`    |
| Admin     | `/admin/dashboard`        |

Unauthenticated users are redirected to `/login`. Authenticated users attempting to reach
another role's pages are redirected back to their own dashboard.

## Notes on Backend Compatibility

- The frontend consumes your existing Express APIs exactly as implemented — no mock data,
  no invented endpoints, and no additional roles.
- Customer profile editing does **not** allow changing email, matching the backend's
  `PUT /api/customers/:id` behavior.
- Collector and Admin profile pages are **read-only** because the backend does not currently
  expose update endpoints for those roles (`collectorRoutes.js` / no admin CRUD routes).
  If you add those endpoints later, the profile pages are the natural place to wire in edit
  forms (they already follow the same pattern as the customer profile page).
- Dashboard "Request Status Breakdown" and per-customer/collector summary cards are computed
  client-side from `GET /api/requests/...` and `GET /api/admin/requests`, since the backend
  doesn't expose a dedicated statistics endpoint for those breakdowns.
