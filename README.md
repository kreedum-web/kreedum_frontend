# 🏆 Kreedum Frontend

> Customer-facing ecommerce frontend for the **Kreedum Sports Ecommerce Platform**.

A modern, responsive React application built to consume the Kreedum Backend REST APIs and provide the complete customer shopping experience — from product discovery to checkout, saved addresses, orders, and account management.

---

## 🚀 Project Status

**Version:** `Frontend v1.0.0`

**Development Phase:** Phase 4 — Frontend Development 🚧

The frontend foundation, reusable design system, routing architecture, API layer, and state-management architecture are currently being implemented.

### Current Progress

| Module | Status |
|---|---|
| React + Vite Setup | ✅ Completed |
| Tailwind CSS v4 | ✅ Completed |
| ESLint | ✅ Completed |
| UI Design System | ✅ Completed |
| React Router | ✅ Completed |
| Axios API Architecture | 🟡 In Progress |
| Authentication State | 🟡 In Progress |
| Cart State | 🟡 In Progress |
| Wishlist State | 🟡 In Progress |
| Global Layout | ⬜ Upcoming |
| Homepage | ⬜ Upcoming |
| Product Listing | ⬜ Upcoming |
| Product Details | ⬜ Upcoming |
| Checkout | ⬜ Upcoming |
| Orders | ⬜ Upcoming |
| Customer Profile | ⬜ Upcoming |

---

# ✨ Features

## 🛍️ Ecommerce Experience

The frontend will provide:

- Product discovery
- Category browsing
- Brand browsing
- Search
- Product filtering
- Product sorting
- Product details
- Wishlist
- Shopping cart
- Checkout
- Saved addresses
- Order history
- Order tracking
- Customer profile

---

## 👤 Customer Account

- Customer registration
- Customer login
- JWT-based authentication
- Profile management
- Password management
- Dashboard
- Saved addresses
- Wishlist
- Cart

---

## 📍 Smart Checkout

The checkout experience will support Indian pincode lookup.

```text
Customer enters PIN Code
        ↓
Kreedum Backend
        ↓
India Post Pincode API
        ↓
City / District / State / Locality
        ↓
Checkout form auto-filled
```

This reduces manual address entry and improves the checkout experience.

---

# 🎨 Design System

Kreedum uses a reusable UI design system rather than styling every page independently.

### Brand Colors

| Token | Value |
|---|---|
| Primary | `#2C62E0` |
| Primary Dark | `#1F49B8` |
| Navy | `#0E1A3D` |
| Navy Soft | `#16234A` |
| Background | `#F6F8FC` |
| White | `#FFFFFF` |

### Reusable Components

- Button
- Input
- Badge
- Loader
- Product Skeleton
- Section Title
- Empty State

The design system is intended to keep the application visually consistent while still allowing page-level customization.

---

# 🧱 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool and development server |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Axios | REST API integration |
| TanStack Query | API caching and server-state management |
| Context API | Authentication, cart and wishlist state |
| Framer Motion | UI animations |
| Swiper | Product and hero carousels |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| ESLint | Code quality |

---

# 📁 Project Architecture

```text
kreedum_frontend/
│
├── public/
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── logo/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   └── profile/
│   │
│   ├── constants/
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── WishlistContext.jsx
│   │
│   ├── hooks/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetails/
│   │   ├── Auth/
│   │   ├── Wishlist/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Orders/
│   │   ├── Profile/
│   │   └── Error/
│   │
│   ├── providers/
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── jsconfig.json
├── vite.config.js
├── package.json
└── README.md
```

---

# 🏗️ Frontend Architecture

The frontend follows a layered architecture:

```text
React Pages
    ↓
Reusable Components
    ↓
Context / Hooks
    ↓
Services / API Layer
    ↓
Axios
    ↓
Kreedum Backend REST API
```

Authenticated requests automatically include the JWT bearer token.

---

# 🔌 Backend Integration

The frontend consumes the dedicated Kreedum Backend:

```text
Kreedum Frontend
        ↓
Axios
        ↓
Kreedum Backend
        ↓
Node.js + Express
        ↓
MongoDB Atlas
```

Backend repository:

```text
https://github.com/potterheadvibhor/kreedum_backend
```

---

# 📡 API Integration Map

| Frontend Feature | Backend API |
|---|---|
| Homepage | `/api/v1/homepage` |
| Products | `/api/v1/products` |
| Search | `/api/v1/search` |
| Categories | `/api/v1/categories` |
| Brands | `/api/v1/brands` |
| Register | `/api/v1/auth/register` |
| Login | `/api/v1/auth/login` |
| Current User | `/api/v1/auth/me` |
| Wishlist | `/api/v1/wishlist` |
| Cart | `/api/v1/cart` |
| Pincode Lookup | `/api/v1/address/pincode/:pincode` |
| Saved Addresses | `/api/v1/addresses` |
| Orders | `/api/v1/orders` |
| Profile | `/api/v1/profile` |

---

# 🧭 Application Routes

Planned customer routes:

```text
/
├── /products
├── /product/:slug
├── /login
├── /register
├── /wishlist
├── /cart
├── /checkout
├── /orders
└── /profile
```

Protected routes will require customer authentication.

---

# 🧪 Frontend QA Strategy

Frontend development follows the same structured approach used for the backend.

Each chapter will include:

1. Implementation
2. Browser testing
3. Responsive testing
4. API integration testing
5. Error-state testing
6. Loading-state testing
7. Git commit

### Key QA Areas

- Desktop responsiveness
- Mobile responsiveness
- API loading states
- API error states
- Authentication persistence
- Protected routes
- Cart synchronization
- Wishlist synchronization
- Checkout flow
- Order flow

---

# ⚡ Installation

## Clone Repository

```bash
git clone https://github.com/potterheadvibhor/kreedum_frontend.git
cd kreedum_frontend
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Kreedum Sports
VITE_APP_ENV=development
```

## Start Development Server

```bash
npm run dev
```

Application:

```text
http://localhost:5173
```

---

# 🏗️ Build for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# 🛣️ Frontend Roadmap

## Phase 4 — Frontend Development

### ✅ Completed

- React + Vite foundation
- Tailwind CSS setup
- ESLint
- Kreedum design tokens
- Reusable UI components
- React Router foundation
- Route protection architecture

### 🚧 In Progress

- Axios API architecture
- Authentication state
- Cart state
- Wishlist state
- React Query integration

### ⬜ Upcoming

- Global Navbar
- Footer
- Search UI
- Homepage
- Product Listing
- Product Details
- Login / Register
- Wishlist
- Cart
- Checkout
- Saved Address UI
- Orders
- Order Tracking
- Customer Profile
- Responsive Optimization
- SEO
- Production Deployment

---

# 🐳 Future Production Deployment

The frontend will eventually be containerized and deployed independently from the backend.

Planned production architecture:

```text
Kreedum Frontend
       ↓
Docker / Nginx
       ↓
Vercel or Production Server
       ↓
Kreedum Backend API
```

Production environment variables will use the live API domain instead of localhost.

---

# 📂 Related Repositories

| Repository | Purpose |
|---|---|
| `kreedum_frontend` | React ecommerce storefront |
| `kreedum_backend` | Ecommerce REST API |
| `ms-scrapper` | Metro Sports supplier product scraper |
| `kreedum-construction` | Kreedum construction vertical |

---

# 👨‍💻 Developer

**Vibhor Jain**

AI Associate Engineer — Kreedum Sports

Building the Kreedum Sports Ecommerce Platform using:

**React + Vite + Tailwind CSS + Node.js + Express.js + MongoDB**

---

## 📄 License

Internal project for **Kreedum Sports**.