import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthModalProvider } from "./context/AuthModalContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ToastProvider from "./components/ToastProvider.jsx";
import useAuthStore from "./store/authStore.js";

import "./index.css";

// Apply saved theme before initial paint
const savedTheme = localStorage.getItem("vanta-theme");
const systemDark = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const initialTheme =
  savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : systemDark
    ? "dark"
    : "light";

document.documentElement.classList.toggle("dark", initialTheme === "dark");

// Initialize auth asynchronously without blocking initial render
useAuthStore.getState().initializeAuth();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthModalProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthModalProvider>
      <ToastProvider />
    </BrowserRouter>
  </StrictMode>
);
