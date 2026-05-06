# 🛒 ShopMERN — Full-Stack E-Commerce Platform

A production-ready MERN stack e-commerce application with Razorpay payment integration.

---

## 📁 Project Structure

```
mern-ecommerce/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── razorpay.js       # Razorpay instance
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect + admin guard
│   │   ├── errorMiddleware.js  # Global error handler
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seeder.js          # Seed products + users
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                 # React + Vite
    ├── src/
    │   ├── api/
    │   │   ├── axios.js        # Axios instance + interceptors
    │   │   └── services.js     # All API calls
    │   ├── components/
    │   │   ├── auth/PrivateRoute.jsx
    │   │   ├── cart/CartItem.jsx
    │   │   ├── layout/Navbar.jsx
    │   │   ├── orders/OrderBadge.jsx
    │   │   ├── products/ProductCard.jsx
    │   │   └── ui/Spinner.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx  # JWT auth state
    │   │   └── CartContext.jsx  # Cart state
    │   ├── hooks/
    │   │   ├── useProducts.js
    │   │   └── useRazorpay.js  # Razorpay checkout hook
    │   ├── pages/
    │   │   ├── auth/           # Login, Register
    │   │   ├── cart/           # Cart page
    │   │   ├── checkout/       # Checkout + Razorpay trigger
    │   │   ├── home/           # Landing page
    │   │   ├── orders/         # Orders list + detail
    │   │   ├── products/       # Products list + detail
    │   │   └── profile/        # User profile
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm install
npm run seed          # Seeds 12 products + admin/demo accounts
npm run dev           # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_RAZORPAY_KEY_ID=rzp_test_...
npm install
npm run dev           # Starts on http://localhost:5173
```

---

## 🔑 Demo Accounts (after seeding)

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@shopmern.in | admin123 |
| User  | demo@shopmern.in  | demo123  |

---

## 🌐 API Endpoints

| Method | Route                     | Access  | Description               |
| ------ | ------------------------- | ------- | ------------------------- |
| POST   | /api/auth/register        | Public  | Register user             |
| POST   | /api/auth/login           | Public  | Login                     |
| GET    | /api/auth/me              | Private | Get logged-in user        |
| GET    | /api/products             | Public  | List products (paginated) |
| GET    | /api/products/:id         | Public  | Product detail            |
| POST   | /api/products             | Admin   | Create product            |
| GET    | /api/cart                 | Private | Get user cart             |
| POST   | /api/cart                 | Private | Add to cart               |
| PUT    | /api/cart/:itemId         | Private | Update cart item          |
| DELETE | /api/cart/:itemId         | Private | Remove cart item          |
| POST   | /api/orders               | Private | Create order              |
| GET    | /api/orders/my            | Private | My orders                 |
| GET    | /api/orders/:id           | Private | Order detail              |
| POST   | /api/payment/create-order | Private | Create Razorpay order     |
| POST   | /api/payment/verify       | Private | Verify payment signature  |
| POST   | /api/payment/webhook      | Public  | Razorpay webhook          |
| GET    | /api/user/profile         | Private | Get profile               |
| PUT    | /api/user/profile         | Private | Update profile            |
| PUT    | /api/user/change-password | Private | Change password           |

---

## 🔐 Security

- JWT authentication with 7-day expiry
- bcrypt password hashing (12 salt rounds)
- Razorpay HMAC-SHA256 signature verification
- Input validation via express-validator
- CORS configured for frontend origin only

## 🚢 Deployment

- **Backend** → Render.com (set env vars in dashboard)
- **Frontend** → Vercel (set `VITE_API_URL` and `VITE_RAZORPAY_KEY_ID`)
- **Database** → MongoDB Atlas (free tier works fine)
