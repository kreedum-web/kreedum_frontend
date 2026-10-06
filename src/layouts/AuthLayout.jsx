import { Link } from "react-router-dom";
import { Dumbbell, ShieldCheck, Truck, Award } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex bg-gradient-to-br from-[#0E1A3D] via-[#1F49B8] to-[#2C62E0] text-white p-14 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur">
              <Dumbbell className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Kreedum Sports</h2>
              <p className="text-blue-100 text-sm">
                India's Sports Equipment Store
              </p>
            </div>
          </Link>

          <div className="mt-20 space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Train Better. <br />
              Perform Stronger.
            </h1>

            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
              Shop premium gym equipment, sports accessories, fitness gear and
              professional training essentials.
            </p>
          </div>
        </div>

        <div className="space-y-5 text-blue-100">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-white" />
            <span>100% Secure Checkout</span>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-white" />
            <span>Pan India Delivery</span>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-white" />
            <span>Trusted Sports Infrastructure Brand</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0E1A3D]">{title}</h2>
            <p className="text-gray-500 mt-2">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}