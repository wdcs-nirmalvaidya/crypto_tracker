import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-open login box if coming from signup
  const [showLogin, setShowLogin] = useState(
    location.state?.fromSignup === true
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem("token", "loggedin");
      navigate("/home");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/trading.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* CONTENT */}
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

          {/* CTA PILLS (DEFAULT VIEW) */}
          {!showLogin && (
            <div className="flex items-center justify-center gap-6">
              <Link
                to="/signup"
                className="
                  px-10 py-4 rounded-full
                  bg-white text-[#0b1320]
                  font-semibold
                  hover:bg-gray-200
                  transition
                "
              >
                Sign Up Now
              </Link>

              <button
                onClick={() => setShowLogin(true)}
                className="
                  px-10 py-4 rounded-full
                  border border-white/60
                  text-white font-semibold
                  hover:bg-white/10
                  transition
                "
              >
                Login
              </button>
            </div>
          )}

          {/* LOGIN FORM */}
          {showLogin && (
            <div
              className="
                mt-10 mx-auto
                w-[380px]
                rounded-2xl
                p-8
                backdrop-blur-xl
                bg-white/10
                border border-white/20
                shadow-2xl
                text-white
              "
            >
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/10 border border-white/20
                    text-white outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full px-4 py-3 rounded-lg
                    bg-white/10 border border-white/20
                    text-white outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />

                <button
                  type="submit"
                  className="
                    w-full py-3 rounded-full
                    border border-white/60
                    text-white font-semibold
                    hover:bg-white/10
                    transition
                  "
                >
                  Sign In
                </button>
              </form>

              {/* BACK */}
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
    </div>
  );
}
