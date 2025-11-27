<h1 align="center">
  <img src="packages/assets/spinny-logo.gif" width="100" height="100" />
  <br />
  Mint Boutique
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Turborepo-FF1E56?style=for-the-badge&logo=turborepo&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p align="center">
 <em>"Fresh plants, fresh vibe. Good mood blooms from inside 🌱"</em>
</p>

A modern e-commerce bouquet shop, designed to feel calm, clean, and effortless. It lets customers glide through categories, compare products, discover details, and check out without friction&mdash;a simple, welcoming place to browse flowers, plants, and accessories at their own pace!

**Features:**

* :convenience_store: A clean, friendly shopping interface with categories, product details, and responsive design.
* :label: Smart search & filtering&mdash;filter by category, price, popularity, and sort however you like!
* :shopping: Full checkout flow with address, shipping, discounts, loyalty points, and VNPay online payment.
* :truck: Automatic GHN shipping fee calculation and delivery tracking.
* :package: Manage inventory, orders, analytics, customers, discounts; all in one dashboard!

## Usage

### Requirements

* Node.js v22.0+ (currently only `npm` is supported)
* MongoDB 8.4+
* Redis (for storing revoked tokens)
* An SMTP server (Recommend Mailpit for development)

As an alternative to Redis, you can spin up a Valkey server using Docker:

```bash
docker run -p 6379:6379 --name valkey -d valkey/valkey valkey-server --save 60 1
```

### Installation

1. Install all packages:

```bash
npm install
```

2. Setup the enviroment variables `.env`:

| Key | Description | Default |
| --- | --- | --- |
| `VITE_STORE_PORT` | Port for the storefront | `5173` |
| `VITE_ADMIN_PORT` | Port for the admin panel | `5174` |
| `VITE_API_URL` | API base URL | `http://localhost:5000` |
| `VITE_STORE_URL` | Storefront URL | `http://localhost:5173` |
| `VITE_ADMIN_URL` | Admin URL | `http://localhost:5174` |
| `PORT` | API port | `5000` |
| `STORE_URL` | Storefront URL (server-side) | `http://localhost:5173` |
| `ADMIN_URL` | Admin URL (server-side) | `http://localhost:5174` |
| `DATABASE_URL` | Mongo connection string | &mdash; |
| `JWT_SECRET` | Auth secret | &mdash; |
| `SMTP_HOST` | SMTP host | `localhost` |
| `SMTP_PORT` | SMTP port | `1025` |
| `SMTP_USER` | SMTP user | &mdash; |
| `SMTP_PASS` | SMTP pass | &mdash; |
| `SMTP_SECURE` | Use SSL/TLS | `false` |
| `VNP_TMNCODE` | VNPay terminal code | &mdash; |
| `VNP_HASHSECRET` | VNPay secret key | &mdash; |
| `VNP_URL` | VNPay payment URL | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
| `VNP_RETURNURL` | VNPay callback | `http://localhost:5000/payment/vnpay/callback` |
| `GHN_SHOP_ID` | GHN Shop ID | &mdash; |
| `GHN_TOKEN` | GHN API token | &mdash; |
| `GOOGLE_CLIENT_ID` | Google OAuth | &mdash; |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | &mdash; |
| `FACEBOOK_APP_ID` | Meta OAuth | &mdash; |
| `FACEBOOK_APP_SECRET` | Meta OAuth | &mdash; |

3. Generate Prisma schema and seed data:

```bash
cd apps/api
npm run db:push  # or `npm run db:generate`
npm run db:seed
```

4. Start the project:

```bash
cd ../..  # if still at `apps/api`
npm run dev  # or `npx turbo dev`
```

5. Access the pages using these links below:

| Server / Page | URL |
| --- | --- |
| **API** | ![localhost:5000](http://localhost:5000) |
| **Store** | ![localhost:5173](http://localhost:5173) |
| **Admin** | ![localhost:5174](http://localhost:5174) |
