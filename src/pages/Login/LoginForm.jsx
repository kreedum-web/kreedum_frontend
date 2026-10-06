import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button, Input } from "@/components/common";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[52px] text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex justify-between items-center text-sm">
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-[#2C62E0]"
          />
          Remember Me
        </label>

        <button
          type="button"
          className="text-[#2C62E0] font-medium hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <Button variant="primary" className="w-full py-3 text-base">
        Login
      </Button>
    </form>
  );
}