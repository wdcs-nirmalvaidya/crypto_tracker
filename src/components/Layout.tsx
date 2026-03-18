import { ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { API_BASE_URL } from "../config";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ================= TIMER START ================= */

  const startExpiryTimer = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeLeft = expirationTime - currentTime;

      // Clear old timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (timeLeft <= 0) {
        setShowPopup(true);
        return;
      }

      timerRef.current = setTimeout(() => {
        setShowPopup(true);
      }, timeLeft);

    } catch (err) {
      console.error("Invalid token");
      handleLogout();
    }
  };

  /* ================= CHECK TOKEN ON LOAD ================= */

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    startExpiryTimer(token);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

  }, []);

  /* ================= STAY HERE (REFRESH TOKEN) ================= */

  const handleStay = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      handleLogout();
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!res.ok) {
        throw new Error("Refresh failed");
      }

      const data = await res.json();

      // 🔥 Save new access token
      localStorage.setItem("accessToken", data.accessToken);

      // Close popup
      setShowPopup(false);

      // 🔥 Restart timer with new token
      startExpiryTimer(data.accessToken);

    } catch (err) {
      console.error("Refresh error:", err);
      handleLogout();
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 🔥 CLEAR EVERYTHING
    localStorage.clear();

    setShowPopup(false);

    navigate("/login");
  };

  /* ================= UI ================= */

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0b1320] text-[#0b1320] dark:text-white transition-colors duration-300">
        <Navbar />
        <main className="w-full">{children}</main>
      </div>

      {/* SESSION EXPIRED POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111A2B] p-8 rounded-2xl shadow-xl text-center w-[380px]">

            <h2 className="text-xl font-semibold mb-4 text-white">
              Session Expired
            </h2>

            <p className="text-sm mb-6 text-gray-300">
              Your session has expired. Do you want to stay here or logout?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={handleStay}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
              >
                Stay Here
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
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

export default Layout;
