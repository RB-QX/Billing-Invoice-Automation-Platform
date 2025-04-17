# Solution Approach

## 1. Project Architecture

- **Backend (Node.js + Express):** Single Express application structured in modules (routes, services, middlewares, mock data) to simulate a microservices‑like separation:
  - `auth` routes for Google OAuth and session management via Passport and express‑session
  - `usage` & `billing` routes for protected REST APIs returning mock metrics
  - `invoice` route generating PDF invoices with PDFKit and triggering a Zapier webhook

- **Frontend (Vite + React + Tailwind CSS):** Single‑page app with React Router:
  - **`GoogleLoginButton`**: A simple redirect to backend's `/auth/google` to initiate OAuth
  - **`Dashboard`**: Protected page fetching user, usage, and billing data every 5 s
  - **Reusable components** (`UsageCard`, `BillingCard`, `InvoiceButton`) for UI consistency

- **Automation (Zapier):** A Zapier Catch‑Hook to listen for invoice events:
  - Backend posts invoice data (email, amount, period) to the Zapier webhook URL
  - Zapier action sends an email (or logs to a sheet) automatically upon each invoice generation

---

## 2. Google OAuth Flow

1. **User clicks** "Sign in with Google" button on the frontend.
2. **Frontend** performs a **full‑page redirect** to `GET /auth/google` on the backend.
3. **Passport.js** initiates the OAuth 2.0 flow, redirecting the user to Google's consent screen.
4. After consent, Google calls back to `/auth/google/callback` with an authorization code.
5. **Passport** exchanges the code for tokens, obtains the user profile, then **serializes** and **stores** the profile in session (via express‑session).
6. Backend **redirects** the authenticated user to `http://localhost:5173/dashboard`.

Security:
- Session cookies use `sameSite: lax` to allow cross‑port logins while mitigating CSRF risks.
- Secrets are stored in environment variables and **never committed** to version control.

---

## 3. API & Data Flow

- **Protected Endpoints:** `/api/usage` and `/api/billing` use a `requireAuth` middleware to check `req.user` from session.
- **Data Source:** Mock in-memory data keyed by `user.email`. Easily replaced by a real database (e.g., MongoDB, PostgreSQL) in production.
- **Invoice Generation:** The `/api/invoice/generate` endpoint:
  1. Reads billing data for the user
  2. Creates a PDF using **PDFKit**, saved under `invoices/`
  3. Sends the PDF path to the frontend
  4. Fires a **Zapier Webhook** asynchronously to automate downstream billing actions

---

## 4. Frontend Features

- **Real‑time Data Refresh:** Polls protected APIs every 5 seconds with `cache: 'no-store'`, ensuring fresh data without 304 responses.
- **Component‑based UI:** Tailwind CSS for rapid styling, ensuring a consistent glassmorphic look with rounded cards, shadows, and gradients.
- **Logout Flow:** Uses `window.location.assign` to hit `/auth/logout`, which clears session and redirects back to login—avoiding CORS issues.

---

## 5. Challenges & Solutions

- **Session Persistence with CORS:** Enabled `credentials: true` and `sameSite: lax` in cookies, plus `Cache-Control: no-store` to prevent 304 cache issues.
- **Passport + express-session:** Switched from `cookie-session` (incompatible with `req.session.regenerate`) to `express-session` for stable session management.
- **Secret‑Scanning Protection:** Removed `.env` from version control, added to `.gitignore`, and merged cleanup history to satisfy push protection.
- **Logout CORS Error:** Resolved by using a full‑page redirect instead of `fetch`, letting the browser follow backend redirects outside CORS restrictions.

---

## 6. Future Improvements

- **Persistent Data Store:** Replace in-memory mocks with a real database and add support for multiple billing cycles and invoice histories.
- **Real‑time Updates via WebSockets:** Use Socket.io or SSE for push‑based updates rather than polling.
- **Role‑Based Access & User Profiles:** Add an admin panel, user roles, and editable profile settings.
- **Invoice Customization:** Allow users to upload logos, choose templates, and download invoice history in the frontend.
- **Testing & CI/CD:** Add unit/integration tests (Jest, Cypress) and a GitHub Actions pipeline for automated builds and deployments.

---

**End of Solution Approach**

