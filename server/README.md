Vanta Ecomm Backend

REST API backend for Vanta Ecomm, a modern full-stack fashion e-commerce platform covering Dresses, Tops, Bags, Footwear, and Jewelry.

The backend provides the core server-side services for authentication, products, categories, carts, orders, addresses, reviews, payments, image uploads, and administrative operations.

✨ Features

Authentication & Authorization

User registration and login

JWT-based authentication

Protected API routes

Admin authorization

Password hashing

Authentication middleware

🛍️ Product & Category Management

Product CRUD operations

Category management

Product slugs

Product collections

Product search/filtering support

Image upload handling

Cloudinary integration for product media

🛒 Shopping & Customer Features

Cart management

Saved addresses

Order creation and retrieval

Order details

Product reviews

Customer-specific protected resources

💳 Payments

Razorpay integration

Payment order creation

Payment verification

Razorpay webhook support

Raw request-body handling for webhook verification

🛠️ Admin Operations

Admin-only protected endpoints

Product management

Category management

Order management

Order status workflows

Administrative data access

🔐 API Security

Helmet security headers

CORS configuration

Request rate limiting

Request body size limits

Centralized validation middleware

Centralized error handling

Protected routes and role-based access

🧰 Tech Stack

Node.js

Express

MongoDB

Mongoose

JWT

bcryptjs

Zod

Razorpay

Cloudinary

Multer

Helmet

CORS

express-rate-limit

cookie-parser

slugify

Vitest

Supertest

🏗️ Architecture

Client / Frontend
       │
       │ HTTP / REST API
       ▼
┌──────────────────────┐
│   Express Server     │
│                      │
│  Routes              │
│    ↓                 │
│  Middleware          │
│    ↓                 │
│  Controllers         │
│    ↓                 │
│  Models / Mongoose   │
└──────────┬───────────┘
           │
           ▼
      ┌──────────┐
      │ MongoDB  │
      └──────────┘

External Services
├── Cloudinary → Product image storage
└── Razorpay   → Payment processing

📁 Project Structure

src/
├── config/
│   ├── cloudinary.js
│   ├── cors.js
│   ├── db.js
│   ├── env.js
│   └── razorpay.js
│
├── constants/
│
├── context/
│
├── controllers/
│   ├── addressController.js
│   ├── authController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── reviewController.js
│   └── uploadController.js
│
├── middleware/
│   ├── authenticateUser.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   ├── requireAdmin.js
│   ├── upload.js
│   ├── uploadImages.js
│   └── validate.js
│
├── models/
│
├── routes/
│   ├── addressRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   └── reviewRoutes.js
│
└── app.js

🔌 API Modules

The API is organized by feature rather than placing all endpoints in a single route file.

Module

Responsibility

Auth

Registration, login, authentication

Products

Product browsing and management

Categories

Category operations

Cart

Customer cart management

Orders

Order creation and management

Addresses

Saved customer addresses

Reviews

Product reviews

Payments

Razorpay payment operations

Uploads

Product/image upload handling

🔐 Request Flow

HTTP Request
     │
     ▼
CORS / Helmet
     │
     ▼
Rate Limiter
     │
     ▼
Authentication / Authorization
     │
     ▼
Validation
     │
     ▼
Route
     │
     ▼
Controller
     │
     ▼
Mongoose Model
     │
     ▼
MongoDB

For failures, requests are passed to the centralized error handler.

⚙️ Environment Variables

Create a .env file in the backend project root.

Typical configuration includes the values required by the application's database, authentication, Cloudinary, Razorpay, and CORS configuration.

Do not commit .env or production credentials to Git.

Example structure:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLIENT_URL=http://localhost:5173

Use the exact variable names required by your existing environment configuration.

🚀 Getting Started

Prerequisites

Install:

Node.js

npm

MongoDB or a MongoDB Atlas database

Cloudinary account for image uploads

Razorpay account for payment functionality

1. Clone the repository

git clone https://github.com/sharmarujula123-gif/vanta-bags-ecomm.git
cd vanta-bags-ecomm

After the repository is renamed, use the updated vanta-ecomm repository URL.

2. Install dependencies

npm install

3. Configure environment variables

Create .env and add the required backend configuration.

4. Start the development server

npm run dev

The API will run on the configured port.

5. Verify the API

The backend exposes:

GET /
GET /api/health

A successful health response confirms that the server is running.

🧪 Testing

The backend uses Vitest and Supertest for automated testing.

Run the project's configured test command:

npm test

If a watch-mode script is configured:

npm run test:watch

🛡️ Security Practices

The backend includes several defensive layers:

Helmet security middleware

Configurable CORS policy

API rate limiting

JWT authentication

Admin authorization middleware

Request validation

Password hashing

Restricted upload handling

Request body size limits

Centralized error handling

Secrets and third-party credentials should always be supplied through environment variables.

☁️ External Services

Cloudinary

Cloudinary is used for product media and image storage, keeping large image assets outside the application server.

Razorpay

Razorpay is integrated for online payment processing. The backend also provides webhook handling and verifies payment-related requests.

📊 Backend Responsibilities

The backend acts as the application's central business layer between the frontend and external services.

It handles:

Authentication

Authorization

Product data

Category data

Cart state

Customer addresses

Orders

Reviews

Payment workflows

Image uploads

Administrative operations

Validation

Security middleware

Error handling

🔄 Frontend Integration

The backend is designed to work with the Vanta Ecomm React frontend.

Vanta Ecomm Frontend
        │
        │ Axios / REST
        ▼
Vanta Ecomm Backend
        │
   ┌────┼───────────────┐
   ▼    ▼               ▼
MongoDB Cloudinary    Razorpay

🚢 Deployment Checklist

Before deploying:

Set production environment variables

Configure the production frontend origin in CORS

Use a secure JWT secret

Configure MongoDB Atlas or another production MongoDB instance

Configure Cloudinary credentials

Configure Razorpay production credentials

Verify webhook configuration

Test authentication and admin authorization

Test product and order flows

Run the automated test suite

Confirm that secrets are not committed to Git

🔮 Future Improvements

Potential backend improvements include:

Expanded automated test coverage

API documentation with OpenAPI/Swagger

Advanced inventory management

Coupon and promotion services

More granular admin permissions

Structured application logging

Background jobs for notifications

Order email notifications

Advanced analytics endpoints

Improved observability and monitoring

🎯 Project Purpose

Vanta Ecomm was built to demonstrate practical full-stack backend engineering skills, including:

REST API design

Node.js and Express development

MongoDB and Mongoose

JWT authentication

Role-based authorization

E-commerce business workflows

Payment integration

Cloud media management

API validation

Security middleware

Automated API testing

Modular backend architecture

📌 Project Summary

Project: Vanta Ecomm
Type: Full-Stack Fashion E-commerce Platform
Backend: Node.js + Express
Database: MongoDB + Mongoose
Authentication: JWT
Payments: Razorpay
Media: Cloudinary
Validation: Zod
Testing: Vitest + Supertest



                         YOUR PLATFORM
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
     LEARN                  PRACTICE               BUILD
       │                      │                      │
  Courses                  DSA / SQL              Projects
  Tutorials                MCQs                    Templates
  Q&A                      Coding                 Challenges
  Notes                    Quizzes                Hackathons
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
                         CAREER TOOLS
                              │
             ┌────────────────┼────────────────┐
             │                │                │
          Resume          Interviews       Portfolio
          Builder         AI/Mock           Builder
          Templates       Interviews        Templates
             │                │                │
             └────────────────┼────────────────┘
                              │
                         OPPORTUNITIES
                              │
                    Hackathons / Jobs /
                    Internships / Challenges