# DAKAF AVAILABLES

A Jumia-style e-commerce scaffold for DAKAF AVAILABLES: React (Vite + Tailwind) frontend, Node/Express + SQLite backend, Google OAuth for shoppers, and an admin panel for managing products and categories.

## What's included

- **Public storefront** — product grid, category filter, product detail page
- **Google sign-in for users** — accounts persist in SQLite, keyed by Google account
- **Admin panel** — reachable via an "Admin" link on the site footer, not a hidden URL
  - Username/password login, checked against a bcrypt hash in the database (not hardcoded)
  - Add categories and subcategories
  - Add/delete products, assign to a category, upload an image
  - Everything persists in SQLite + local file storage across reloads

## Project structure

```
jumia-clone/
├── server/          Express API, SQLite database, image uploads
└── client/          React + Vite + Tailwind frontend
```

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- Set `SESSION_SECRET` and `JWT_SECRET` to long random strings.
- Fill in `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (create an OAuth 2.0 Client ID, add `http://localhost:4000/api/auth/google/callback` as an authorized redirect URI).
- Set `INITIAL_ADMIN_USERNAME` and `INITIAL_ADMIN_PASSWORD` to your real admin credentials.

Then create the first admin account (this hashes the password — it's never stored as plain text):

```bash
npm run seed:admin
```

Start the API:

```bash
npm run dev
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`. The dev server proxies `/api` and `/uploads` to the backend on port 4000.

## How the admin panel works

- Go to the site, scroll to the footer, click **Admin** (or visit `/admin/login` directly).
- Log in with the username/password you set in `.env` before seeding.
- You'll get a JWT stored in `sessionStorage`, used to authorize all admin API calls. It expires after 8 hours.
- From the dashboard you can create categories (optionally nested under a parent), and add products with an image, price, stock, and category assignment.

## Notes on what's stubbed vs. production-ready

- **Image storage** currently saves files to `server/uploads/` on local disk. That's fine for development, but most hosting platforms wipe local disk on redeploy — for production, swap the multer disk storage in `server/src/middleware/upload.js` for an S3/Cloudinary upload.
- **Database** is SQLite for simplicity (zero setup, one file). For production traffic, migrating to Postgres is straightforward since the queries are plain SQL.
- **Cart/checkout/payments** aren't built yet — `orders` and `order_items` tables exist in the schema as a starting point.
- **Admin roles** are single-tier (any row in `admins` has full access). Add a `role` column if you need tiered permissions later.
