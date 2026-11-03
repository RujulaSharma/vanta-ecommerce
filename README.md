# 👜 VANTA — Luxury Fashion & Lifestyle E-Commerce Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.9-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vitest](https://img.shields.io/badge/Tests-8%20Passed-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

> A modern, production-grade full-stack luxury fashion and lifestyle e-commerce application. Engineered with an emphasis on high performance, enterprise architecture patterns, fluid Framer Motion choreography, resilient authentication pipelines, and responsive design across all viewports (from 360px mobile to 1920px ultrawide).

🌐 **Live Production Deployment:** [https://vanta-bags-ecomm.onrender.com](https://vanta-bags-ecomm.onrender.com)  

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Key Features](#-key-features)
  - [Customer Experience](#-customer-experience)
  - [Motion & Micro-Interactions](#-motion--micro-interactions)
  - [Admin Management Suite](#-admin-management-suite)
- [Engineering Highlights](#-engineering-highlights)
  - [Silent JWT Token Refresh Interceptor](#1-silent-jwt-token-refresh-interceptor)
  - [Compound Database Indexing](#2-compound-database-indexing)
  - [Role-Based Access Control (RBAC)](#3-role-based-access-control-rbac)
  - [Optimistic Cart & State Management](#4-optimistic-cart--state-management)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation & Local Execution](#installation--local-execution)
  - [Database Seeding](#database-seeding)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [REST API Reference](#-rest-api-reference)
- [License](#-license)

---

## 🏛️ Architectural Overview

```text
                                  ┌────────────────────────────────┐
                                  │       React 19 SPA Client      │
                                  │   Vite • Zustand • Tailwind v4 │
                                  │ Framer Motion • React Hook Form│
                                  └───────────────┬────────────────┘
                                                  │
                             HTTPS / JSON REST (Dual Cookie & Bearer JWT)
                                                  │
                                                  ▼
                                  ┌────────────────────────────────┐
                                  │     Express 5 API Gateway      │
                                  │ Helmet • CORS • Rate Limiter   │
                                  │  Zod Validation • Error Envelop│
                                  └───────────────┬────────────────┘
                                                  │
                       ┌──────────────────────────┼──────────────────────────┐
                       ▼                          ▼                          ▼
             ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
             │ MongoDB (Mongoose)│      │  Cloudinary Media │      │ Razorpay Gateway  │
             │ Compound Indexes  │      │ Direct Multer CDN │      │ Order Creation &  │
             │  Data Persistence │      │  Asset Pipeline   │      │ Signature Verify  │
             └───────────────────┘      └───────────────────┘      └───────────────────┘
```

---

## ✨ Key Features

### 🛍️ Customer Experience
- **Three-Tier Marketplace Navigation:** Global announcement utility bar, responsive search input with debounced category queries, and horizontal scrollable category navigation pills.
- **Product Discovery & Multi-Filtering:** Dynamic server-side pagination, search by title/keywords, category filtering, price range sorting, stock status, and color/material tags.
- **Dynamic Cart Management:** Real-time stock reservation checks, optimistic quantity adjustment, automatic subtotal/free shipping threshold calculations (`₹2,000` tier).
- **Wishlist & Persistent State:** Instant toggle with local storage persistence synced with user sessions.
- **Multi-Address Checkout:** Saved address book management, inline form validation via React Hook Form, and seamless Razorpay integration.
- **Order Lifecycle & Tracking:** Transparent post-checkout tracking, live status badge progression, and cancellation safeguards.
- **Product Ratings & Reviews:** Verified purchaser feedback system with rating aggregates and comments.
- **Dark / Light Mode:** Native design-system token switching (`var(--vanta-bg)`, `var(--vanta-surface)`, `var(--vanta-text)`, `var(--vanta-gold)`) supporting system preferences and manual toggles.

### 🎬 Motion & Micro-Interactions
- **Auto-Advancing Hero Carousel:** 6-second auto-rotation with `AnimatePresence` cross-fade transitions and interactive pause-on-hover.
- **Scroll-Triggered Reveals:** Sections gently fade and rise into view using Framer Motion `whileInView` observers (`viewport: { once: true }`).
- **Tactile Card Interactions:** Subtle spring lifts (`whileHover={{ y: -5 }}`) with image zoom transitions on product cards.
- **Celebratory Confetti:** Realistic dual-burst luxury gold and emerald confetti on checkout completion powered by `canvas-confetti`.
- **Global Scroll-to-Top:** Seamless page restoration on navigation plus an ergonomic floating back-to-top button appearing after 450px scroll depth.
- **Animated Modal Dialogs:** Spring-scale modal animations for authentication and quick product actions.

### 🛡️ Admin Management Suite
- **Executive KPI Dashboard:** Real-time metrics tracking Gross Revenue, Total Orders, Paid vs. Pending breakdown, Active Products, and Low Stock alerts.
- **Catalog & Inventory Control:** Interactive modal for creating and updating products with multi-image Cloudinary uploads, SKU tracking, and real-time stock counters.
- **Order Fulfillment Pipeline:** Live status transition controls (`pending` ➔ `processing` ➔ `shipped` ➔ `delivered` / `cancelled`) with automated transition validations.
- **Role-Based Guards:** Server middleware (`verifyAdmin`) coupled with React Router `AdminRoute` protection preventing unauthorized access.

---

## 🔐 Engineering Highlights

### 1. Silent JWT Token Refresh Interceptor
Authentication implements a dual-token strategy: a short-lived access token (`15m`) and a secure, HttpOnly refresh token (`7d`).
To prevent disruptive session disconnects:
- The client Axios instance traps `401 Unauthorized` responses via response interceptors.
- It queues concurrent outgoing requests and invokes `/api/auth/refresh`.
- Upon successful token issuance, queued requests replay automatically with the renewed credentials.

### 2. Compound Database Indexing
To ensure sub-50ms query latency across hundreds of concurrent catalog requests:
```javascript
// High-traffic filter combinations
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, createdAt: -1 });

// Full-text search index for catalog lookup
productSchema.index({ name: "text", description: "text" });

// Fast customer order retrieval
orderSchema.index({ user: 1, createdAt: -1 });
```

### 3. Role-Based Access Control (RBAC)
- All administrator routes are guarded at the gateway level using layered middleware: `verifyAuth` followed by `verifyAdmin`.
- Non-admin attempts return a uniform `403 Forbidden` response.
- Client navigation dynamically reflects user permissions, hiding admin panels from standard accounts.

### 4. Optimistic Cart & State Management
- Built with **Zustand**, providing lightweight, performant global state without boilerplate.
- Cart changes trigger immediate optimistic UI updates while orchestrating asynchronous backend synchronization.
- Graceful error rollback safeguards against inconsistent network states.

---

## 🛠️ Technology Stack

| Layer | Technologies | Description |
|---|---|---|
| **Frontend Core** | React 19.2, Vite 8.2 | Modern UI library with blazing-fast lightning bundler |
| **Styling & Design** | Tailwind CSS v4.3, Lucide Icons | Utility-first CSS engine with custom luxury theme tokens |
| **Animation & Motion** | Framer Motion 14.9, Canvas-Confetti | Hardware-accelerated transitions & celebratory effects |
| **State & Networking** | Zustand 5.0, Axios, React Hook Form | Global store, HTTP interceptor client & robust forms |
| **Backend Runtime** | Node.js (v18+), Express 5.2 | Scalable REST API gateway with async middleware |
| **Database & ODM** | MongoDB, Mongoose 9.9 | NoSQL database with schema validation & compound indexes |
| **Security & Auth** | JWT, bcryptjs, Helmet, Rate Limiter | Dual-token authentication with HTTP-only cookies |
| **Validation** | Zod 4.4 | Runtime payload schema validation |
| **External Integrations**| Cloudinary, Razorpay | Image CDN asset processing & secure payment gateway |
| **Testing & Quality** | Vitest 4.1, Supertest, ESLint | Unit and integration test suites with zero lint errors |

---

## 📁 Project Directory Structure

```text
vanta-ecomm/
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable atomic UI components
│   │   │   ├── admin/          # Admin-specific forms, tables & headers
│   │   │   ├── checkout/       # Address & order summary components
│   │   │   ├── AuthModal.jsx   # Animated auth popup dialog
│   │   │   ├── Footer.jsx      # Footer with newsletter & links
│   │   │   ├── Navbar.jsx      # 3-tier marketplace header
│   │   │   └── ScrollToTop.jsx # Route restoration & back-to-top button
│   │   ├── layouts/            # MainLayout & AdminLayout shells
│   │   ├── pages/              # Application views (Home, Products, Orders, Admin...)
│   │   ├── services/           # Axios API services (auth, product, cart, order)
│   │   ├── store/              # Zustand global stores (authStore, cartStore)
│   │   └── utils/              # Currency formatters, token helpers & order styles
│   ├── index.html              # Optimized SEO & font-preconnect template
│   └── package.json
│
├── server/                     # Backend REST API Server
│   ├── src/
│   │   ├── config/             # DB connection, Cloudinary, Razorpay config
│   │   ├── controllers/        # Request handlers (auth, product, order, cart)
│   │   ├── middlewares/        # Auth, admin guards, multer & error handler
│   │   ├── models/             # Mongoose schemas (User, Product, Order, Category)
│   │   ├── routes/             # Express API route declarations
│   │   ├── seed/               # Database seeder scripts
│   │   ├── utils/              # Token generation & API response envelopes
│   │   ├── app.js              # Express app initialization & middleware
│   │   └── server.js           # Server entry point
│   ├── tests/                  # Vitest backend integration tests
│   └── package.json
│
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas URI)
- Optional: Free Cloudinary & Razorpay test accounts

### Environment Variables

#### Backend (`server/.env`)
Create a file at `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/vanta_ecommerce

# Authentication Secrets
JWT_SECRET=your_super_secure_access_secret_key_12345
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_12345
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Media CDN (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend (`client/.env`)
Create a file at `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Installation & Local Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RujulaSharma/vanta-ecomm.git
   cd vanta-ecomm
   ```

2. **Install dependencies:**
   ```bash
   # Install server packages
   cd server
   npm install

   # Install client packages
   cd ../client
   npm install
   ```

3. **Start the development servers:**
   ```bash
   # Terminal 1 - Backend Server (Port 5000)
   cd server
   npm run dev

   # Terminal 2 - Frontend Client (Port 5173)
   cd client
   npm run dev
   ```

Visit `http://localhost:5173` to experience the application.

### Database Seeding
To populate your MongoDB database with sample categories and luxury products:
```bash
cd server
npm run seed
```

---

## 🧪 Testing & Quality Assurance

Both frontend and backend include automated verification scripts:

```bash
# 1. Run Backend Vitest Test Suite (8/8 tests across 5 suites)
cd server
npm test

# 2. Run Frontend ESLint Code Analysis (Zero errors, zero warnings)
cd client
npm run lint

# 3. Verify Production Production Bundle Compilation
cd client
npm run build
```

---

## 📡 REST API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate customer & set HttpOnly refresh cookie | Public |
| `POST` | `/api/auth/refresh` | Silently renew short-lived JWT access token | Refresh Cookie |
| `POST` | `/api/auth/logout` | Revoke session & clear authentication cookies | Authenticated |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & addresses | Authenticated |

### Products & Catalog (`/api/products` & `/api/categories`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Query paginated catalog with filters & sorting | Public |
| `GET` | `/api/products/:id` | Fetch full single product specifications | Public |
| `GET` | `/api/categories` | List active luxury categories & hierarchies | Public |
| `POST` | `/api/products/:id/reviews` | Submit verified customer review & rating | Authenticated |

### Shopping Cart (`/api/cart`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/cart` | Retrieve current user's shopping cart | Authenticated |
| `POST` | `/api/cart/items` | Add product with quantity & inventory check | Authenticated |
| `PUT` | `/api/cart/items/:productId` | Modify cart item quantity | Authenticated |
| `DELETE` | `/api/cart/items/:productId` | Remove individual line item from cart | Authenticated |
| `DELETE` | `/api/cart` | Empty all items from active cart | Authenticated |

### Orders & Checkout (`/api/orders`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/orders` | Create order, validate stock & issue Razorpay ID | Authenticated |
| `POST` | `/api/orders/verify-payment` | Verify HMAC cryptographic payment signature | Authenticated |
| `GET` | `/api/orders/my-orders` | Fetch customer's personal order history | Authenticated |
| `GET` | `/api/orders/:id` | Retrieve itemized order details | Authenticated |
| `PUT` | `/api/orders/:id/cancel` | Cancel order prior to shipping | Authenticated |

### Administrator Suite (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/orders` | Fetch all orders across entire system | Admin Only |
| `GET` | `/api/admin/orders/:id` | Retrieve comprehensive admin order details | Admin Only |
| `PUT` | `/api/admin/orders/:id/status`| Progress order status (`processing`, `shipped`, etc.) | Admin Only |
| `POST` | `/api/products` | Create product with Multer/Cloudinary media | Admin Only |
| `PUT` | `/api/products/:id` | Update product catalog details and stock | Admin Only |
| `DELETE` | `/api/products/:id` | Soft-deactivate product from storefront | Admin Only |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
