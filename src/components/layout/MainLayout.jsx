import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: '"Manrope", sans-serif',
        backgroundColor: "#F6F8FC",
      }}
    >
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}