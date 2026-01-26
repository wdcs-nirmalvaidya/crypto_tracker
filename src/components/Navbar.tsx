import { useEffect, useState, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Theme } from "../types/auth";




const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);

  // ✅ Safe initial theme
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light"
      ? saved
      : "light"; // default light
  });

  // 🌗 Apply theme globally
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔄 Toggle
  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-[#0b1320] border-b border-gray-200 dark:border-[#1c2940] text-black dark:text-white px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white">
          ₿
        </div>
        <Link className="hover:text-blue-500" to="/home">
          Crypto
        </Link>
      </div>

      {/* 🔗 LINKS */}
      <div className="flex items-center gap-6">
        <Link className="hover:text-blue-500" to="/home">
          Home
        </Link>
        <Link className="hover:text-blue-500" to="/exchanges">
          Exchanges
        </Link>
        <Link className="hover:text-blue-500" to="/watchlist">
          Watchlist
        </Link>

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
};

export default Navbar;
