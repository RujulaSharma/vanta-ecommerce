import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import ScrollToTop from "../components/ScrollToTop";

const MainLayout = () => {
  return (
    <div className="vanta-app-shell flex min-h-screen flex-col transition-colors duration-300">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <AuthModal />
    </div>
  );
};

export default MainLayout;
