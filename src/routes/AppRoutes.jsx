import { Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";

import HomePage from "@/pages/Home/HomePage";
import ProductsPage from "@/pages/Products/ProductsPage";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import AuthContextTest from "@/pages/Test/AuthContextTest";
import NotFoundPage from "@/pages/Error/NotFoundPage";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ProductDetailPage from "@/pages/ProductDetail/ProductDetailPage";
import SearchResultsPage from "@/pages/Search/SearchResultsPage";
import FloatingContactActions from "@/components/common/FloatingContactActions";
import CartPage from "@/pages/Cart/CartPage";
import WishlistPage from "@/pages/Wishlist/WishlistPage";
import CheckoutPage from "@/pages/Checkout/CheckoutPage";
import AddressesPage from "@/pages/Account/AddressesPage";
import OrdersPage from "@/pages/Account/OrdersPage";
import AccountPage from "@/pages/Account/AccountPage";
import ProfilePage from "@/pages/Account/ProfilePage";
import ContactPage from "@/pages/Contact/ContactPage";
import PrivacyPolicyPage from "@/pages/Company/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/pages/Company/TermsAndConditionsPage";
import ReturnPolicyPage from "@/pages/Company/ReturnPolicyPage";
import AboutUsPage from "@/pages/Company/AboutUsPage";
import OrderDetailsPage from "@/pages/Account/OrderDetailsPage";


export default function AppRoutes() {
  return (
    <>
    <ScrollToTop />
      <FloatingContactActions />
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />}/>
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account/addresses" element={<AddressesPage />}/>
        <Route path="/account/orders" element={<OrdersPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/refund-policy" element={<ReturnPolicyPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />}/>
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/account/orders/:orderId" element={<OrderDetailsPage />}/>
      </Route>

      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Development QA */}
      <Route
        path="/auth-test"
        element={<AuthContextTest />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}