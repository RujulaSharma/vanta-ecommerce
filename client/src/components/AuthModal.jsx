import { tw } from "../utils/twStyles.js";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";

import authImage from "../assets/category/hero.jpg";
import { useAuthModal } from "../context/AuthModalContext";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AuthModal = () => {
  const dialogRef = useRef(null);
  const { mode, isOpen, closeAuth } = useAuthModal();

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousFocus = document.activeElement;
    const focusFrame = requestAnimationFrame(() => dialogRef.current?.querySelector("input")?.focus());
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeAuth();
      if (event.key !== "Tab") return;

      const controls = dialogRef.current?.querySelectorAll("button:not(:disabled), input:not(:disabled)");
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      const target = event.shiftKey ? last : first;
      const boundary = event.shiftKey ? first : last;
      if (document.activeElement === boundary || !dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        target.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
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
            ref={dialogRef}
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
              <img src={authImage} alt="" />
              <div className={tw("vanta-auth-image-overlay")} />
              <div className={tw("vanta-auth-image-copy")}>
                <span>VANTA</span>
                <strong>
                  Your account
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
