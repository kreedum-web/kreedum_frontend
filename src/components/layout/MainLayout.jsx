import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BirthdayPopup from "@/components/common/BirthdayPopup";
import AnnouncementBanner from "./AnnouncementBanner";


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

      {/* Reserve space for the fixed navbar */}
      {/* <div className="h-[112px] shrink-0 md:h-[80px]" /> */}

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BirthdayPopup />
    </div>
  );
}