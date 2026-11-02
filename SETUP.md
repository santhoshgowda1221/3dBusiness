# 3D print shop: setup and project notes

Medusa 2 backend + Next.js storefront for a Bengaluru 3D printing business.
Customers upload an STL, see it in 3D, get an instant INR quote and add the print to the cart.

## Set up on a new computer

Requirements: Git, Node.js 22.23+ (24 LTS works). No PostgreSQL install needed.

1. Clone and install:

   ```bash
   git clone <your-repo-url> print-shop
   cd print-shop
   npm install
   ```

2. Start the portable database (keep this terminal open). The first run creates
   `.dev-db/` and an empty `printshop` database:

   ```bash
   npm run db
   ```

3. Backend environment, in a second terminal:

   ```bash
   cd apps/backend
   cp .env.template .env
   ```

   In `.env`, replace `JWT_SECRET` and `COOKIE_SECRET` with long random strings.

4. Create tables and seed data (demo products, Europe region, India region with
   GST, Bengaluru workshop, couriers, publishable key):

   ```bash
   npx medusa db:migrate
   ```

5. Create your admin login:

   ```bash
   npx medusa user -e you@example.com -p <choose-a-password>
   ```

6. Storefront environment:

   ```bash
   npx medusa exec ./src/scripts/print-publishable-key.ts
   cd ../storefront
   cp .env.template .env.local
   ```

   Paste the printed `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=...` line into `.env.local`.

7. Run everything (database still running in its own terminal):

   ```bash
   cd ../..
   npm run dev
   ```

- Storefront: http://localhost:8000/in/quote
- Admin: http://localhost:9000/app

Each computer has its own database. Orders, uploaded files and admin users are not
shared through git, only code is.

## Day-to-day on two computers

- Before starting work: `git pull`, then `npm install` (if dependencies changed)
  and `cd apps/backend && npx medusa db:migrate` (if migrations or migration scripts changed).
- When done: commit and `git push`.

## What the quote feature is made of

| Piece | File |
| --- | --- |
| STL parser (binary + ASCII, volume, bounding box) | `apps/backend/src/lib/stl.ts` |
| Pricing rates and formula (INR, placeholder numbers) | `apps/backend/src/lib/print-pricing.ts` |
| Quote and add-to-cart workflows | `apps/backend/src/workflows/print-quote/` |
| `POST /store/print-quotes` | `apps/backend/src/api/store/print-quotes/` |
| `POST /store/carts/:id/print-items` | `apps/backend/src/api/store/carts/[id]/print-items/` |
| India region, GST, Bengaluru workshop, couriers | `apps/backend/src/migration-scripts/region-india.ts` |
| Uploaded customer STL files (private, not web-served) | `apps/backend/uploads/private/` |
| Unit tests | `apps/backend/src/lib/__tests__/` |
| Quote page UI and 3D viewer | `apps/storefront/src/modules/quote/` |
| Cart server actions | `apps/storefront/src/lib/data/print-cart.ts` |
| Portable dev database | `scripts/dev-db.mjs` |
| **Shop name, contact details, menu** | `apps/storefront/src/lib/brand.ts` |
| **Site wording: services, FAQ, reviews, projects** | `apps/storefront/src/modules/site/data.ts` |
| Material descriptions shown on the site | `apps/storefront/src/lib/print-materials.ts` |
| Homepage sections and shared site components | `apps/storefront/src/modules/site/components/` |
| Services, Projects, Design, About, Contact pages | `apps/storefront/src/app/[countryCode]/(main)/` |
| Starter print catalog (hides demo clothing) | `apps/backend/src/migration-scripts/shop-catalog.ts` |

Prices are always recomputed on the server from the uploaded file.

## Troubleshooting

- **Storefront doesn't see a new region:** stop it, delete
  `apps/storefront/.next/dev/cache/fetch-cache`, start it again.
- **Port 5432 already in use:** another PostgreSQL is running. Stop it, or change the
  port in `scripts/dev-db.mjs` and `DATABASE_URL` in `apps/backend/.env`.
- **"Filename too long" on Windows git:** run `git config --global core.longpaths true`.

## Known gaps / next steps

- Pricing numbers are placeholders: set real filament cost, machine rate and setup fee in `print-pricing.ts`.
- Removing a print from the cart leaves its setup fee line behind.
- Switching a cart from India to another region would keep the INR amounts on print items.
- Admin has no STL download button yet: files are in `apps/backend/uploads/private`, matched by `file_id` in the line item metadata.
- Full checkout of a print order has not been tested.
- Production needs a private S3 bucket for uploads instead of the local folder.
