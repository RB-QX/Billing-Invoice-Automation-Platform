# Billing & Invoice Automation Platform

A full‑stack application to authenticate users via Google OAuth, display SaaS usage and billing details, generate PDF invoices, and automate billing actions through Zapier.

---

## Overview

This project demonstrates a 24‑hour sprint to build an automated billing and invoice platform with:

- **Google OAuth 2.0** authentication (Passport.js + Express‑session)
- **Usage & Billing** data retrieval via protected REST APIs
- **PDF Invoice Generation** using PDFKit
- **Automation** integration with **Zapier** Webhooks
- **React + Tailwind CSS** frontend for a polished dashboard UI

---

## Tech Stack

| Layer          | Technologies                                      |
| -------------- | ------------------------------------------------- |
| **Backend**    | Node.js, Express, express‑session, Passport.js    |
| **PDF Engine** | PDFKit                                           |
| **Automation** | Zapier Webhooks (Catch Hook + Email/Sheet Action) |
| **Frontend**   | Vite, React, React Router, Tailwind CSS          |
| **HTTP Client**| Fetch API, Axios                                 |

---

## Prerequisites

- **Node.js** v14 or higher
- **npm** (Node Package Manager)
- Google Cloud project with OAuth 2.0 credentials
- Zapier account to obtain a Webhook URL

---

## Setup & Run

### 1. Clone the Repository

```bash
git clone https://github.com/RB-QX/Billing-Invoice-Automation-Platform.git
cd Billing-Invoice-Automation-Platform
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env            # Copy and fill in your credentials
# Edit backend/.env:
#   GOOGLE_CLIENT_ID=
#   GOOGLE_CLIENT_SECRET=
#   SESSION_SECRET=
#   ZAPIER_HOOK_URL=

npm install
npm start                        # Server starts on port 5000
```

### 3. Frontend Setup

```bash
cd ../frontend
cp .env .env.local               # Copy and fill in your variables
# Edit frontend/.env:
#   VITE_GOOGLE_CLIENT_ID=
#   VITE_API_BASE=http://localhost:5000

npm install
npm run dev                      # Dev server on http://localhost:5173
```

---

## Environment Variables

**Backend (`backend/.env`):**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=a-random-session-secret
ZAPIER_HOOK_URL=https://hooks.zapier.com/...
```

**Frontend (`frontend/.env`):**
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE=http://localhost:5000
```

---

## API Endpoints

### Authentication

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/auth/google`              | Redirect user to Google OAuth page  |
| GET    | `/auth/google/callback`     | OAuth callback and session setup    |
| GET    | `/auth/current_user`        | Fetch the logged‑in user's profile  |
| GET    | `/auth/logout`              | Clear session & redirect to frontend |

### Usage & Billing

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/api/usage`                | Return current user's usage metrics  |
| GET    | `/api/billing`              | Return current billing info          |
| POST   | `/api/invoice/generate`     | Generate PDF invoice & trigger Zapier|

### Invoice Files

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/invoices/:filename`       | Serve generated invoice PDFs         |

---

## Folder Structure

```
billing-invoice-automation/       # root
├── backend/                      # Node.js + Express API
│   ├── routes/                   # auth, usage, billing, invoice
│   ├── services/                 # passport setup
│   ├── middlewares/              # auth guard
│   ├── mock/                     # simulated data
│   ├── invoices/                 # generated PDFs
│   ├── app.js                    # Express server
│   └── .env.example              # env template
├── frontend/                     # Vite + React + Tailwind
│   ├── src/
│   │   ├── components/           # UI cards, buttons
│   │   ├── pages/                # Dashboard
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env                      # frontend vars
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md                     # this file

