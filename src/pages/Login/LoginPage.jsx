import { Link } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "./LoginForm";
import { COLORS } from "@/config/theme";

export default function LoginPage() {
  return (
   <AuthLayout
  title="Welcome back"
  subtitle="Sign in to explore sports equipment and manage your Kreedum account."
>
  <LoginForm />

  <div className="mt-2 text-center text-sm text-gray-600">
    Don't have an account?{" "}
    <Link
      to="/register"
      className="font-bold hover:underline"
      style={{ color: COLORS.blue }}
    >
      Create an account
    </Link>
  </div>
</AuthLayout>
  );
}