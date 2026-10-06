import { Link } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue shopping on Kreedum Sports."
    >
      <LoginForm />

      <div className="mt-8 text-center text-gray-600">
        Don't have an account? {" "}
        <Link
          to="/register"
          className="text-[#2C62E0] font-semibold hover:underline"
        >
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
}