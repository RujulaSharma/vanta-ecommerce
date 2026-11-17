import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";

const AuthEntry = ({ mode }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    openAuth(mode);
    navigate("/", { replace: true, state });
  }, [mode, openAuth, navigate, state]);

  return null;
};

export default AuthEntry;
