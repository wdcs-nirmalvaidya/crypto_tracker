import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  // 🌗 Apply theme globally
  useEffect(() => {
    const root = document.documentElement; // <html>

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function handleLogout(e) {
    e.stopPropagation();
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="bg-white dark:bg-[#0b1320] border-b border-gray-200 dark:border-[#1c2940] text-black dark:text-white px-8 py-4 flex justify-between items-center">
      
      {/* 🔷 LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white">
          ₿
        </div>
        <h1 className="text-xl font-bold">Crypto Tracker</h1>
      </div>

      {/* 🔗 LINKS */}
      <div className="flex items-center gap-6">
        <Link className="hover:text-blue-500" to="/home">Home</Link>
        <Link className="hover:text-blue-500" to="/exchanges">Exchanges</Link>
        <Link className="hover:text-blue-500" to="/watchlist">Watchlist</Link>

        {/* 🌙 THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1c2940] flex items-center justify-center text-lg transition"
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* 👤 PROFILE */}
        <div className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="bg-gray-200 dark:bg-[#1c2940] px-4 py-2 rounded-lg"
          >
            Profile ▾
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#111a2b] text-black dark:text-white rounded-lg shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#1c2940]"
                onClick={() => setOpen(false)}
              >
                View Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
