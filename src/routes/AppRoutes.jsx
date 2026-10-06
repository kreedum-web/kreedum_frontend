import { Routes, Route } from "react-router-dom";

import HomePage from "@/pages/Home/HomePage";
import ProductsPage from "@/pages/Products/ProductsPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import NotFoundPage from "@/pages/Error/NotFoundPage";
import LoginPage from "@/pages/Login";
import AuthContextTest from "@/pages/Test/AuthContextTest";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
 
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/auth-test" element={<AuthContextTest />} />
      <Route path="/login" element={<LoginPage />} />

    </Routes>
  );
}