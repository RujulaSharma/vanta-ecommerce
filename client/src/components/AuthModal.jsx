import { tw } from "../utils/twStyles.js";
import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AUTH_IMAGE = "https://res.cloudinary.com/q9toon94/image/upload/v1786812733/vanta-bags/products/handbag-4.jpg";
import { useAuthModal } from "../context/AuthModalContext";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AuthModal = () => {
  const { mode, isOpen, closeAuth } = useAuthModal();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeAuth();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeAuth]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={tw("vanta-auth-overlay")}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAuth();
          }}
        >
          <motion.div
            className={tw("vanta-auth-modal")}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vanta-auth-title"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={tw("vanta-auth-image")}>
              <img src={AUTH_IMAGE} alt="VANTA Bags collection" />
              <div className={tw("vanta-auth-image-overlay")} />
              <div className={tw("vanta-auth-image-copy")}>
                <span>VANTA BAGS</span>
                <strong>
                  Carry your
                  <br />
                  signature.
                </strong>
              </div>
            </div>

            <button
              type="button"
              className={tw("vanta-auth-close")}
              onClick={closeAuth}
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.8} />
            </button>

            {mode === "register" ? <Register /> : <Login />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
