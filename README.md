# Vanta Ecomm 🛍️

A modern, production-grade full-stack fashion & lifestyle e-commerce platform engineered with React 19, Vite, Node.js, Express, and MongoDB.

Built with real-world architecture in mind: silent JWT refresh interceptors, compound database indexing, role-based access control (RBAC), optimistic client state synchronization, responsive design across all viewports, and payment integration.

---

## 🏛️ System Architecture

```text
                                  ┌────────────────────────┐
                                  │      React 19 SPA      │
                                  │  Vite • Zustand • RHF  │
                                  └───────────┬────────────┘
                                              │
                         HTTPS / JSON REST API (with Cookie / Bearer Auth)
                                              │
                                              ▼
                                  ┌────────────────────────┐
                                  │  Express API Gateway   │
                                  │ Security • CORS • Zod  │
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      ▼                       ▼                       ▼
            ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
            │ MongoDB (Mongoose)│   │    Cloudinary     │   │     Razorpay      │
            │ Compound Indexes  │   │  CDN Media Asset  │   │  Checkout Payment │
            │  Data Persistence │   │     Pipeline      │   │     Gateway       │
            └───────────────────┘   └───────────────────┘   └───────────────────┘
```

---

## ✨ Key Features & Technical Highlights

### 🛍️ Customer Experience
- **Authentication & Security:** HTTP-only cookie + Bearer JWT token dual-strategy with automatic silent 401 refresh interceptor.
- **Product Discovery:** Real-time search, category hierarchy, multi-criteria filtering (price, color, material, featured), and responsive pagination.
- **Interactive Shopping Cart:** Real-time stock validation, persistent state, quantity management, automated subtotal/shipping tier calculations.
- **Wishlist & Recently Viewed:** Instant toggling, localStorage persistence, and cross-navigation item restoration.
- **Streamlined Checkout:** Saved multi-address management, client-side validation via React Hook Form, and Razorpay payment workflow.
- **Order Lifecycle & Tracking:** Detailed order history, cancellation safeguards, and shipping status timeline.
- **Product Reviews & Ratings:** Verified user feedback system with star ratings and comments.

### 🛡️ Admin Management Suite
- **Role-Based Access Control:** Secure server-side middleware and frontend `AdminRoute` protection.
- **Inventory & Catalog Management:** Full CRUD product management with Cloudinary image upload pipeline.
- **Order Processing:** Real-time status progression (`pending` -> `processing` -> `shipped` -> `delivered`), cancellation controls, and financial summaries.
- **Analytics & Dashboard:** Visual metrics for total revenue, active orders, customer acquisition, and inventory alerts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Zustand, Tailwind CSS v4, Lucide Icons, React Hot Toast, React Hook Form |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose ODM, Zod, JSON Web Tokens (JWT), bcryptjs, Cookie-Parser, CORS |
| **External Services** | Cloudinary (Media CDN), Razorpay (Payment Gateway) |
| **Testing & Quality** | Vitest, Supertest, ESLint (Flat Config), Postman |

---

## 🔐 Security & Reliability Patterns

1. **Silent Token Refresh:** The client Axios instance automatically intercepts `401 Unauthorized` responses and silently requests a new `accessToken` using `/api/auth/refresh`, resuming failed requests seamlessly.
2. **Input Validation:** Backend endpoints use Zod schemas and Mongoose validation to strictly reject malformed payloads before processing.
3. **Database Performance:** Strategic compound indexes on `{ category: 1, isActive: 1 }`, `{ price: 1, isActive: 1 }`, `{ user: 1, createdAt: -1 }`, and text index on `{ name: "text", description: "text" }`.
4. **Centralized Error Handling:** Uniform API error response structure `{ success: false, message, error }` with automatic mapping for Mongoose `CastError`, `ValidationError`, and duplicate key conflicts (`11000`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas cluster)
- Cloudinary Account & Razorpay Test Account (optional for media/payment testing)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/vanta-bags-ecomm.git
cd vanta-bags-ecomm
```

### 2. Environment Configuration

#### Backend Setup (`server/.env`):
Create a `server/.env` file based on `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/vanta_ecommerce
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Frontend Setup (`client/.env`):
Create a `client/.env` file based on `client/.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run the Application

```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm run dev
```

The frontend will be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 🧪 Testing & Linting

```bash
# Run backend integration & unit tests
cd server
npm test

# Run frontend lint check
cd client
npm run lint

# Build frontend for production
npm run build
```

---

## 📡 API Reference Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & set session cookies | No |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens | No |
| `POST` | `/api/auth/logout` | Clear session cookies | Yes |
| `POST` | `/api/auth/refresh` | Silently renew expired access token | Refresh Token |
| `GET` | `/api/products` | Paginated product list with search/filters | No |
| `GET` | `/api/products/:id` | Fetch single product details | No |
| `GET` | `/api/cart` | Retrieve user shopping cart | Yes |
| `POST` | `/api/cart/items` | Add item to cart with quantity check | Yes |
| `PUT` | `/api/cart/items/:productId` | Update cart item quantity | Yes |
| `DELETE` | `/api/cart/items/:productId` | Remove item from cart | Yes |
| `GET` | `/api/orders/my-orders` | Fetch user's order history | Yes |
| `POST` | `/api/orders` | Create new order from cart | Yes |
| `PUT` | `/api/orders/:id/cancel` | Cancel order (if eligible) | Yes |
| `GET` | `/api/admin/orders` | Admin: Fetch all orders across system | Admin |
| `PUT` | `/api/admin/orders/:id/status`| Admin: Update order fulfillment status | Admin |
| `POST` | `/api/admin/products` | Admin: Create new product | Admin |
