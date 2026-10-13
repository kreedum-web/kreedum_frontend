
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

import { authService } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input } from "@/components/common";
import { COLORS } from "@/config/theme";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Enter your email address and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.login({
        email: normalizedEmail,
        password,
      });

      // Backend response: { success, message, data: { user, token } }
      const result = response?.data?.data;
      const token = result?.token;
      const user = result?.user;

      if (!token || !user) {
        throw new Error(
          "The server returned an unexpected login response. Please try again."
        );
      }

      login(token, user);

      const requestedPath = location.state?.from;
      const destination =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <Input
        id="login-email"
        name="email"
        label="Email address"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        disabled={loading}
      />

      <div className="relative">
        <Input
          id="login-password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={loading}
          className="pr-12"
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute right-3 top-[38px] flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[#EAF0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C62E0]"
          style={{ color: COLORS.slate }}
          disabled={loading}
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>

     

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: COLORS.tint, color: COLORS.blueDark }}
        >
          {notice}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        className="min-h-12 rounded-xl shadow-md shadow-[#2C62E0]/15 hover:brightness-105"
      >
        {loading ? "Signing in..." : "Sign in"}
        {!loading && <ArrowRight size={18} />}
      </Button>

      <button
        type="button"
        onClick={() =>
          setNotice(
            "Password recovery is not available yet. Please contact Kreedum Sports for assistance."
          )
        }
        className="w-full py-1 text-sm font-semibold hover:underline"
        style={{ color: COLORS.blue }}
      >
        Forgot password?
      </button>
    </form>
  );
}
