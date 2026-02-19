import { useEffect, useState, MouseEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Theme } from "../types/auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light"
      ? saved
      : "light";
  });

  // 🌗 Apply Theme
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔎 Sync search with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  // 🔥 TOKEN EXPIRY CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      const timeLeft = expirationTime - currentTime;

      if (timeLeft <= 0) {
        setSessionExpired(true);
      } else {
        setTimeout(() => {
          setSessionExpired(true);
        }, timeLeft);
      }
    } catch (err) {
      console.error("Invalid token");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const handleLogout = (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    const params = new URLSearchParams(location.search);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    navigate(`${location.pathname}?${params.toString()}`);
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `relative transition duration-200 ${
      isActive(path)
        ? "text-blue-600 dark:text-blue-400 font-semibold"
        : "hover:text-blue-500"
    }`;

  return (
    <>
      <nav className="bg-white dark:bg-[#0b1320] border-b border-gray-200 dark:border-[#1c2940] text-black dark:text-white px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white">
            ₿
          </div>
          <Link className={linkClass("/home")} to="/home">
            Crypto
          </Link>
        </div>

        {/* Links + Search */}
        <div className="flex items-center gap-6">

          <Link className={linkClass("/home")} to="/home">
            Home
          </Link>

          <Link className={linkClass("/exchanges")} to="/exchanges">
            Exchanges
          </Link>

          <Link className={linkClass("/watchlist")} to="/watchlist">
            Watchlist
          </Link>

          {/* 🔍 Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 dark:text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="
                pl-9 pr-4 py-2
                rounded-full
                bg-gray-100 dark:bg-[#1c2940]
                text-black dark:text-white
                text-sm
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                transition
              "
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1c2940] flex items-center justify-center text-lg transition"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Profile */}
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

      {/* 🔥 SESSION EXPIRED MODAL */}
      {sessionExpired && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111a2b] text-black dark:text-white p-8 rounded-2xl shadow-2xl w-[360px] text-center">

            <h2 className="text-xl font-semibold mb-4">
              Session Expired
            </h2>

            <p className="text-sm mb-6 opacity-70">
              Your session has expired.
              Do you want to login again or logout?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setSessionExpired(false);
                  navigate("/login");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Login Again
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setSessionExpired(false);
                  navigate("/login");
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
