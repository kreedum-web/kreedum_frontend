import { useEffect, useRef } from "react";
import { LockKeyhole } from "lucide-react";

import { useSignIn } from "@/contexts/SignInContext";

/**
 * Shown on pages that need an account (cart, orders, checkout…) when nobody
 * is signed in. Opens the sign-in popup straight away; once signed in, the
 * page shows its content without moving anywhere.
 */
export default function SignInRequired({
  title = "Sign in to continue",
  message = "Sign in or create an account to see this page.",
  icon: Icon = LockKeyhole,
  autoOpen = true,
}) {
  const { openSignIn } = useSignIn();
  const opened = useRef(false);

  useEffect(() => {
    if (autoOpen && !opened.current) {
      opened.current = true;
      openSignIn();
    }
  }, [autoOpen, openSignIn]);

  return (
    <main className="min-h-screen bg-[#F6F8FC] px-4 pb-12 pt-[180px] md:pt-[150px]">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF0FF] text-[#2C62E0]">
          <Icon className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-[#0E1A3D]">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <button
          type="button"
          onClick={() => openSignIn()}
          className="mt-6 inline-flex rounded-xl bg-[#2C62E0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1F49B8]"
        >
          Sign in / Create account
        </button>
      </div>
    </main>
  );
}
