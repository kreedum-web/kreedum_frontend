import { Button } from "@/components/common";
import { useAuth } from "@/contexts";

export default function AuthContextTest() {
  const { user, token, loading, isAuthenticated, login, logout } = useAuth();

  const fakeLogin = () => {
    login("jwt-demo-token", {
      name: "Vibhor Jain",
      email: "vibhor@kreedum.com",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold text-[#0E1A3D]">
        Auth Context QA
      </h1>

      <div className="rounded-xl border p-5 space-y-3">
        <p><strong>Loading:</strong> {String(loading)}</p>
        <p><strong>Authenticated:</strong> {String(isAuthenticated)}</p>
        <p><strong>User:</strong> {user?.name || "None"}</p>
        <p><strong>Email:</strong> {user?.email || "None"}</p>
        <p><strong>Token:</strong> {token || "None"}</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={fakeLogin}>Fake Login</Button>

        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}