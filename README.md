# Kreedum Sports — Ecommerce Frontend

The official customer-facing ecommerce frontend for **Kreedum Sports**, built to provide a seamless shopping experience for sports equipment, gym equipment, and related products.

This repository contains the React-based frontend application. The backend REST API is maintained separately in the `kreedum_backend` repository.

---

## Overview

Kreedum Sports is an ecommerce platform designed to help customers discover, explore, and purchase sports and fitness products.

The application provides product discovery, category and brand browsing, authentication, cart management, wishlist functionality, checkout, order tracking, and customer account management.

## Features

### Shopping Experience
- Responsive homepage and product discovery.
- Product listing and product detail pages.
- Category-based product browsing.
- Brand-based product browsing.
- Product search and filtering.
- Product information and pricing display.

### Customer Account
- User registration and login.
- Authentication and protected routes.
- Customer profile management.
- Address management.
- Default delivery address selection.
- Order history and order details.

### Ecommerce Functionality
- Shopping cart management.
- Wishlist management.
- Checkout flow.
- Order placement.
- Order confirmation and order details.

### Additional Pages
- About Us.
- Contact Us.
- Privacy Policy.
- Terms and Conditions.
- Refund Policy.

### User Interface
- Responsive desktop and mobile layouts.
- Mobile-friendly navigation.
- Reusable UI components.
- Shared form components.
- Product carousels and interactive sections.
- Consistent Kreedum branding and design system.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend UI development |
| Vite 8 | Development server and build tooling |
| Tailwind CSS 4 | Styling and responsive layouts |
| React Router 7 | Client-side routing |
| Axios | HTTP requests and API integration |
| TanStack Query | Server-state management |
| React Context API | Global application state |
| Framer Motion | UI animations |
| Swiper | Carousels and sliders |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| ESLint | Code quality and linting |

---

## Project Structure

```text
kreedum_frontend/
│
├── public/
│
├── src/
│   ├── adapters/          # API response adapters
│   ├── api/               # API services and Axios configuration
│   ├── assets/            # Images, icons and static assets
│   ├── components/        # Reusable UI components
│   │   ├── common/
│   │   ├── layout/
│   │   ├── product/
│   │   └── search/
│   │
│   ├── config/            # Application configuration
│   ├── constants/         # Shared constants
│   ├── contexts/          # Global context providers
│   ├── data/              # Static and demo data
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Application layouts
│   ├── pages/             # Application pages
│   ├── providers/         # Context and query providers
│   ├── routes/            # Route configuration
│   ├── utils/             # Utility functions
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

*The structure above describes the main application areas; individual files and folders may evolve as the project develops.*

---

## Application Architecture

The frontend follows a modular architecture that separates UI components, application state, API communication, and routing.

```text
              React Application
                     |
              React Router
                     |
                Page Layer
                     |
          Components and Custom Hooks
                     |
          -------------------------
          |                       |
     Context API             TanStack Query
          |                       |
          -------------------------
                     |
                API Services
                     |
                Axios Client
                     |
              Backend REST API
                     |
              MongoDB Database
```

### State Management

- **React Context API:** Used for shared application state such as authentication, cart, and wishlist.
- **TanStack Query:** Used for managing server state and API-driven data.
- **Axios:** Handles communication between the frontend and backend.

### API Integration

API services are organized inside `src/api/`.

| Service | Responsibility |
|---|---|
| `authService` | Login, registration and authentication |
| `productService` | Product data |
| `categoryService` | Product categories |
| `brandService` | Brand information |
| `homepageService` | Homepage content |
| `searchService` | Product search |
| `cartService` | Shopping cart |
| `wishlistService` | Wishlist |
| `addressService` | Customer addresses |
| `orderService` | Orders and checkout |
| `profileService` | Customer profile |

The shared Axios configuration handles the API base URL, request timeout, and authentication token.

---

## Application Routes

The application currently includes the following main routes:

| Route | Description |
|---|---|
| `/` | Homepage |
| `/products` | All products |
| `/products/:slug` | Product details |
| `/categories` | All categories |
| `/categories/:slug` | Category products |
| `/brands` | All brands |
| `/brands/:slug` | Brand products |
| `/search` | Product search |
| `/wishlist` | Customer wishlist |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/login` | Customer login |
| `/register` | Customer registration |
| `/account` | Customer dashboard |
| `/account/profile` | Profile management |
| `/account/addresses` | Address management |
| `/account/orders` | Order history |
| `/account/orders/:orderId` | Order details |
| `/contact` | Contact page |
| `/about-us` | About page |
| `/terms-and-conditions` | Terms and conditions |
| `/refund-policy` | Refund policy |
| `/privacy-policy` | Privacy policy |

---

## Design System

The application follows the Kreedum Sports brand identity.

| Token | Color | Hex |
|---|---|---|
| Primary Blue | Blue | `#2C62E0` |
| Dark Blue | Blue | `#1F49B8` |
| Navy | Navy | `#0E1A3D` |
| Soft Navy | Navy | `#16234A` |
| Paper Background | Light Grey | `#F6F8FC` |
| White | White | `#FFFFFF` |

The design system aims to maintain visual consistency across product pages, forms, navigation, account pages, and checkout.

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js (LTS recommended)
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/kreedum-web/kreedum_frontend.git
```

### 2. Navigate to the Project

```bash
cd kreedum_frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=15000
```

Update the API base URL according to the backend environment you are using.

**Important:** Vite exposes variables prefixed with `VITE_` to the browser. Never store private keys, database credentials, or other secrets in frontend environment variables.

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at the local URL provided by Vite, usually:

```text
http://localhost:5173
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Backend Integration

The frontend communicates with a separate backend application through REST APIs.

**Backend Repository:**  
https://github.com/kreedum-web/kreedum_backend

The frontend requires a running or deployed backend for features such as:

- Authentication
- Product data
- Categories and brands
- Cart and wishlist
- Customer addresses
- Checkout and orders
- Customer profile

Configure `VITE_API_BASE_URL` to point to the appropriate backend environment.

---

## Deployment

The frontend is designed for deployment on platforms such as Vercel.

### Production Deployment

1. Connect the repository to Vercel.
2. Configure the required environment variables.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Ensure SPA fallback routing is configured.
6. Deploy the application.

The production frontend must point to the production backend API rather than the local development server.

---

## Development Guidelines

To maintain code quality and consistency:

- Use reusable components wherever possible.
- Keep API communication inside the API service layer.
- Avoid duplicating business logic across components.
- Use custom hooks for reusable application logic.
- Maintain responsive layouts for mobile, tablet, and desktop.
- Follow the existing Kreedum design system.
- Keep environment-specific configuration outside source code.
- Test important ecommerce flows before merging changes.

### Git Workflow

The repository uses Git for version control.

Before starting work:

```bash
git pull origin main
```

After making changes:

```bash
git add .
git commit -m "describe your changes"
git push origin main
```

For larger features, use a separate development branch and merge changes after testing.

---

## Related Repositories

| Project | Repository |
|---|---|
| Ecommerce Frontend | https://github.com/kreedum-web/kreedum_frontend |
| Ecommerce Backend | https://github.com/kreedum-web/kreedum_backend |
| Sports Marketing Website | https://github.com/kreedum-web/kreedum-sports |
| Construction Website | https://github.com/kreedum-web/kreedum-construction |

Each repository represents a separate application or project within the Kreedum ecosystem.

---

## Project Information

**Project:** Kreedum Sports Ecommerce  
**Organization:** Kreedum International  
**Repository:** `kreedum_frontend`  
**Application Type:** Ecommerce Frontend  
**Maintained by:** Kreedum Technical Team

---

## License

This is an internal project developed for Kreedum Sports.

All rights reserved. Unauthorized copying, distribution, or commercial use is prohibited.
