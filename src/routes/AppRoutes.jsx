import { Routes, Route } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";

import HomePage from "@/pages/Home/HomePage";
import ProductsPage from "@/pages/Products/ProductsPage";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import AuthContextTest from "@/pages/Test/AuthContextTest";
import NotFoundPage from "@/pages/Error/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
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
  );
}