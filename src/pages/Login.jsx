import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    localStorage.setItem("token", "login-token");
    navigate("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[150px]" />

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md mx-4 bg-[#0b1320]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl text-white">
        
        {/* Modern Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-[#111a2b] border border-white/10 flex items-center justify-center text-3xl shadow-inner">
              <span className="bg-gradient-to-br from-blue-400 to-cyan-300 bg-clip-text text-transparent font-black">
                ₿
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mt-5 tracking-tight">
            Crypto<span className="text-blue-500">Tracker</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-2">
            Securely manage your digital assets
          </p>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 rounded-xl text-center mb-6 animate-pulse">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-600"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all font-bold text-white mt-4 active:scale-[0.98]">
            Sign In
          </button>
        </form>

        {/* Signup Footer */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            New to the platform? 
            <Link to="/signup" className="text-blue-400 font-semibold ml-2 hover:text-blue-300 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}