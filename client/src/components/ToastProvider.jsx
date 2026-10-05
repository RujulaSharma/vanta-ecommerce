import { Toaster } from "react-hot-toast";

const ToastProvider = () => (
  <Toaster
    position="bottom-right"
    gutter={8}
    toastOptions={{
      duration: 3200,
      style: {
        background: "var(--vanta-surface)",
        color: "var(--vanta-text)",
        border: "1px solid var(--vanta-border)",
        borderRadius: "4px",
        padding: "12px 16px",
        fontSize: "13px",
        fontFamily: "inherit",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      },
      success: {
        iconTheme: {
          primary: "var(--vanta-text)",
          secondary: "var(--vanta-surface)",
        },
      },
      error: {
        iconTheme: {
          primary: "#dc2626",
          secondary: "#fff",
        },
      },
    }}
  />
);

export default ToastProvider;
