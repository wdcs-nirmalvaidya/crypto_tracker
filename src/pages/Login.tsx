import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

interface LocationState {
  fromSignup?: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  /* 🔥 Forgot Password State */
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [resetError, setResetError] = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  useEffect(() => {
    if (state?.fromSignup) {
      setShowLogin(true);
    }
  }, [state]);

  /* ================= LOGIN ================= */

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usernameOrEmail: username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.clear();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/home", { replace: true });

    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET PASSWORD ================= */

  const handleResetPassword = async () => {
    setResetError("");

    if (!username) {
      setResetError("Enter your email in login field first");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setResetError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    try {
      setResetLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: username,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setShowForgot(false);
      setNewPassword("");
      setConfirmPassword("");
      alert("Password updated successfully!");

    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/trading.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">

          {/* LOGO */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-3xl font-bold">
              ₿
            </div>
            <h1 className="text-3xl font-semibold mt-4">
              Crypto<span className="text-blue-400">Tracker</span>
            </h1>
            <p className="text-gray-300 mt-1">
              Securely manage your digital assets
            </p>
          </div>

          {!showLogin && (
            <div className="flex items-center justify-center gap-6">
              <Link
                to="/signup"
                className="px-10 py-4 rounded-full bg-white text-[#0b1320] font-semibold hover:bg-gray-200 transition"
              >
                Sign Up Now
              </Link>

              <button
                onClick={() => setShowLogin(true)}
                className="px-10 py-4 rounded-full border border-white/60 text-white font-semibold hover:bg-white/10 transition"
              >
                Login
              </button>
            </div>
          )}

          {showLogin && (
            <div className="mt-10 mx-auto w-[380px] rounded-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-white relative">
              <form onSubmit={handleLogin} className="space-y-4">

                {error && (
                  <p className="text-red-400 text-sm text-center">
                    {error}
                  </p>
                )}

                <input
                  placeholder="Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3 rounded-full border border-white/60 text-white font-semibold hover:bg-white/10 transition disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              {/* Forgot Password Link */}
              <p
                onClick={() => setShowForgot(true)}
                className="mt-4 text-sm text-blue-300 hover:underline cursor-pointer text-center"
              >
                Forgot Password?
              </p>

              <button
                onClick={() => setShowLogin(false)}
                className="mt-4 text-sm text-gray-300 hover:underline"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 GLASS RESET POPUP */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="mt-10 mx-auto w-[380px] rounded-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-white relative">

            <h2 className="text-xl font-bold mb-6 text-center">
              Reset Password
            </h2>

            {resetError && (
              <p className="text-red-400 text-sm mb-4 text-center">
                {resetError}
              </p>
            )}

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowForgot(false)}
                className="px-5 py-2 rounded-lg border border-white/40 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
              >
                {resetLoading ? "Updating..." : "Reset"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Login;