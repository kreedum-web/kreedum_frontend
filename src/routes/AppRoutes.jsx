// import { Routes, Route } from "react-router-dom";

// import HomePage from "@/pages/Home/HomePage";
// import ProductsPage from "@/pages/Products/ProductsPage";
// import ProductDetailsPage from "@/pages/ProductDetails/ProductDetailsPage";
// import LoginPage from "@/pages/Auth/LoginPage";
// import RegisterPage from "@/pages/Auth/RegisterPage";
// import CartPage from "@/pages/Cart/CartPage";
// import WishlistPage from "@/pages/Wishlist/WishlistPage";
// import CheckoutPage from "@/pages/Checkout/CheckoutPage";
// import OrdersPage from "@/pages/Orders/OrdersPage";
// import ProfilePage from "@/pages/Profile/ProfilePage";
// import NotFoundPage from "@/pages/Error/NotFoundPage";

// import ProtectedRoute from "./ProtectedRoute";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/products" element={<ProductsPage />} />
//       <Route path="/product/:slug" element={<ProductDetailsPage />} />

//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/register" element={<RegisterPage />} />

//       <Route
//         path="/cart"
//         element={
//           <ProtectedRoute>
//             <CartPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/wishlist"
//         element={
//           <ProtectedRoute>
//             <WishlistPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/checkout"
//         element={
//           <ProtectedRoute>
//             <CheckoutPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/orders"
//         element={
//           <ProtectedRoute>
//             <OrdersPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <ProfilePage />
//           </ProtectedRoute>
//         }
//       />

//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }



import { Routes, Route } from "react-router-dom";

import HomePage from "@/pages/Home/HomePage";
import ProductsPage from "@/pages/Products/ProductsPage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import NotFoundPage from "@/pages/Error/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}