# VANTA

VANTA is a fashion storefront for handbags, dresses, tops, footwear and jewelry. The React client serves the storefront and admin interface. The Express API manages the catalog, accounts, carts, addresses, orders, payments and reviews in MongoDB.

## Features

- Browse collections or search the catalog. Refine results by category, price, color, material and featured status, then sort and paginate.
- View product imagery, availability and customer reviews. Wishlist and recently viewed items are stored in the browser.
- Sign in to manage your bag, shipping addresses and orders. Checkout reserves inventory while a Razorpay payment is pending, and customers can resume payment before the reservation expires.
- Admin users can manage products, upload product photos, update stock and manage order status.
- Responsive layouts, light and dark themes, and Framer Motion transitions that respect reduced-motion preferences.

## Technology stack

- **Client** · React, React Router, Vite, Tailwind CSS, Framer Motion, Zustand, Axios, React Hook Form and Lucide.
- **API** · Node.js, Express, MongoDB with Mongoose, JWT cookies, bcryptjs, Zod and Multer.
- **Integrations** · Razorpay for checkout and Cloudinary for product uploads.
- **Verification** · ESLint on the client and Vitest with Supertest on the API.

## Run locally

Use Node.js 24 LTS and npm. Point the API at a MongoDB replica set or an Atlas cluster so checkout can use MongoDB transactions.

From the repository root, copy the environment templates and install both sets of dependencies.

~~~powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
npm --prefix client ci
npm --prefix server ci
~~~

Set the following values before starting the app.

- **Client** · Set `VITE_API_URL` to `http://localhost:5000/api` for the default local API.
- **Server** · Set `MONGO_URI` and separate secrets for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`. Keep `NODE_ENV=development`, `PORT=5000` and `CLIENT_URL=http://localhost:5173` for the default local setup.
- **Cloudinary** · Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` for admin image uploads.
- **Razorpay** · Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` using test credentials for local development. Set `RAZORPAY_WEBHOOK_SECRET` to match the webhook configuration when testing callbacks at `/api/payments/webhook`.

Keep both local URLs on the same hostname so the browser can send session cookies. Keep server credentials out of the client environment and out of source control.

Optionally populate a development database with the sample catalog.

~~~sh
npm --prefix server run seed
~~~

Start the API and storefront in separate terminals.

~~~sh
npm --prefix server run dev
npm --prefix client run dev
~~~

Open the storefront at `http://localhost:5173`. Browse or search for a piece, open its product page and sign in to add it to your bag. At checkout, choose a saved address or add one, then pay through Razorpay. Open **Orders** from your account to review order status. Accounts with the admin role can open `/admin`.

## Project structure

~~~text
client/
  public/img/          Local catalog and collection images
  src/components/      Navigation, product cards and checkout controls
  src/layouts/         Storefront and admin layouts
  src/pages/           Storefront, account and admin routes
  src/services/        API client and service methods
  src/store/           Zustand state
server/
  src/config/          Configuration and integrations
  src/controllers/     Request handlers
  src/middleware/      Authentication, validation and uploads
  src/models/          Mongoose schemas
  src/routes/          API routing
  src/scripts/         Catalog seed scripts
  src/services/        Review and order cleanup logic
  src/tests/           API tests
assets/                Repository screenshots
~~~

## Checks

~~~sh
npm --prefix client run lint
npm --prefix client run build
npm --prefix server test
~~~

The production client build goes to `client/dist`. Configure the static host to serve `index.html` for client-side routes. Set the production API URL and allowed client origin before deployment. Production session cookies require HTTPS.

## Screenshots

The storefront with fixture data at desktop and mobile widths.

![VANTA storefront at desktop width](assets/storefront-desktop.jpg)

![VANTA storefront at mobile width](assets/storefront-mobile.jpg)
