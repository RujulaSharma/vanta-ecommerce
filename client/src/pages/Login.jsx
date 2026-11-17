import { tw } from "../utils/twStyles.js";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useAuthModal } from "../context/AuthModalContext";

const Login = () => {
  const navigate = useNavigate();
  const { pathname, search, hash, state } = useLocation();
  const login = useAuthStore((state) => state.login);
  const { closeAuth, switchAuth } = useAuthModal();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(formData);
      const user = data.data?.user;

      closeAuth();
      navigate(state?.from || (user?.role === "admin" ? "/admin" : { pathname, search, hash }), { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={tw("vanta-auth-content")}>
      <div className={tw("vanta-auth-heading")}>
        <h2 id="vanta-auth-title">Sign in</h2>
      </div>

      {error && <div className={tw("vanta-auth-error")}>{error}</div>}

      <form className={tw("vanta-auth-form")} onSubmit={handleSubmit}>
        <label className={tw("vanta-auth-field")}>
          <span>Email Address</span>
          <div className={tw("vanta-auth-input-wrap")}>
            <Mail size={14} />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
        </label>

        <label className={tw("vanta-auth-field")}>
          <span>Password</span>
          <div className={tw("vanta-auth-input-wrap")}>
            <LockKeyhole size={14} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className={tw("vanta-auth-password-toggle")}
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </label>

        <button className={tw("vanta-auth-submit")} type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>



      <p className={tw("vanta-auth-switch")}>
        Don't have an account?{" "}
        <button type="button" onClick={() => switchAuth("register")}>
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
