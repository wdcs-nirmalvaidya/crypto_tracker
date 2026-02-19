import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

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

  // ✅ Auto open login after signup
  useEffect(() => {
    if (state?.fromSignup) {
      setShowLogin(true);
    }
  }, [state]);

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
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usernameOrEmail: username,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 🔥 IMPORTANT: Clear old tokens first
      localStorage.clear();

      // ✅ Store NEW tokens
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // ✅ Store user
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Navigate AFTER storage
      navigate("/home", { replace: true });

    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
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
            <div className="mt-10 mx-auto w-[380px] rounded-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl text-white">
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
};

export default Login;
