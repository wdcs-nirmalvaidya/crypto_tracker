import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { getSocket } from "../socket";
import { API_BASE_URL } from "../config";

import Loader from "../components/Loader";
import { CoinDetailsData } from "../types/common";
import { sendOtp, verifyOtp, buyCoin, sellCoin } from "../services/trade";

interface PricePoint {
  timestamp: number;
  price: number;
}

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [coin, setCoin] = useState<CoinDetailsData | null>(null);
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState<number>(0);

  const [tradeUserId, setTradeUserId] = useState<string | null>(null);
  const [tradeUserLoading, setTradeUserLoading] = useState(true);

  const [marketQty, setMarketQty] = useState<number>(0);

  // 🔥 OTP
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  /* ================= CREATE TRADE USER ================= */
  useEffect(() => {
    const createTradeUser = async () => {
      if (!user?.email) {
        setTradeUserLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/trade/create-user`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          }
        );

        const data = await res.json();
        localStorage.setItem("tradeUserId", data._id);
        setTradeUserId(data._id);
      } catch (err) {
        console.error("Trade user creation failed:", err);
      } finally {
        setTradeUserLoading(false);
      }
    };

    createTradeUser();
  }, []);

  /* ================= FETCH MARKET QUANTITY ================= */
  const fetchMarketQuantity = async (coinName: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/trade/market-quantity/${coinName}`
      );
      const data = await res.json();
      setMarketQty(data.totalAvailableQuantity);
    } catch (err) {
      console.error("Market quantity fetch failed", err);
    }
  };

  /* ---------------- INITIAL FETCH ---------------- */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const coinRes = await fetch(
          `${API_BASE_URL}/coins/${id}`
        );
        if (!coinRes.ok) throw new Error();
        const coinData = await coinRes.json();

        const historyRes = await fetch(
          `${API_BASE_URL}/coins/${id}/history`
        );
        if (!historyRes.ok) throw new Error();
        const historyData = await historyRes.json();

        setCoin(coinData);
        setPrices(historyData || []);
        setLoading(false);

        fetchMarketQuantity(coinData.name);
      } catch {
        setError("Failed to load coin details.");
        setLoading(false);
      }
    };

    if (id) fetchInitialData();
  }, [id]);

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    if (!id || !user?.id) return;

    const socket = getSocket(user.id);

    const handlePriceUpdate = (update: any) => {
      if (String(update.coinId) !== id) return;

      setCoin((prev) =>
        prev ? { ...prev, current_price: update.current_price } : prev
      );

      setPrices((prev) => {
        const newPoint = {
          timestamp: update.timestamp,
          price: update.current_price,
        };
        return [...prev, newPoint].slice(-20);
      });
    };

    socket.on("priceUpdate", handlePriceUpdate);

    return () => {
      socket.off("priceUpdate", handlePriceUpdate);
    };
  }, [id]);

  /* ---------------- OTP TIMER ---------------- */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (otpStep && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpStep, timer]);

  /* ---------------- SEND OTP ---------------- */
  const handleTrade = async () => {
    if (!coin || !tradeUserId || tradeUserLoading) {
      alert("Trade user not ready");
      return;
    }

    if (!quantity || quantity <= 0) {
      alert("Enter valid quantity");
      return;
    }

    try {
      await sendOtp(tradeUserId);
      setOtpStep(true);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  /* ---------------- RESEND OTP ---------------- */
  const handleResendOtp = async () => {
    if (!tradeUserId) return;

    try {
      await sendOtp(tradeUserId);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      alert("Resend failed");
    }
  };

  /* ---------------- VERIFY + EXECUTE ---------------- */
  const confirmOtpAndTrade = async () => {
    if (!coin || !tradeUserId || quantity <= 0 || timer === 0) return;

    try {
      const verifyRes = await verifyOtp(tradeUserId, otp);

      if (!verifyRes.message.includes("verified")) {
        alert("OTP verification failed");
        return;
      }

      let res;

      if (tradeType === "buy") {
        res = await buyCoin(
          tradeUserId,
          coin.name,
          coin.current_price,
          quantity
        );
      } else {
        res = await sellCoin(
          tradeUserId,
          coin.name,
          coin.current_price,
          quantity
        );
      }

      alert(res.message);

      fetchMarketQuantity(coin.name);

      setShowPopup(false);
      setQuantity(0);
      setOtp("");
      setOtpStep(false);
      setTimer(30);
      setCanResend(false);

    } catch (err) {
      console.error(err);
      alert("Trade failed");
    }
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!coin) return null;

  const chartData = {
    labels: prices.map((p) =>
      new Date(p.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Price",
        data: prices.map((p) => p.price),
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white" } },
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.08)" } },
      y: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.08)" } },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            {coin.image && (
              <img
                src={coin.image}
                alt={coin.name}
                className="w-14 h-14 rounded-full shadow"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-black">
                {coin.name}
              </h1>
              <p className="text-lg text-gray-600">
                ${coin.current_price}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              disabled={tradeUserLoading}
              onClick={() => {
                setTradeType("buy");
                setShowPopup(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition disabled:opacity-50"
            >
              Buy
            </button>

            <button
              disabled={tradeUserLoading}
              onClick={() => {
                setTradeType("sell");
                setShowPopup(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition disabled:opacity-50"
            >
              Sell
            </button>
          </div>
        </div>

        {/* LIVE CARD */}
        <div
          className="rounded-2xl p-6 shadow-xl mb-8 text-white flex justify-between"
          style={{ backgroundColor: "#111A2B" }}
        >
          <div>
            <p className="text-gray-300">Live Market</p>
            <p className="text-2xl font-bold">
              ${coin.current_price}
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-300">Available Quantity</p>
            <p className="text-2xl font-bold">{marketQty}</p>
          </div>
        </div>

        {/* CHART */}
        <div
          className="rounded-2xl p-6 shadow-xl text-white"
          style={{ backgroundColor: "#111A2B" }}
        >
          <h2 className="text-lg font-semibold mb-4">
            Live Price Chart
          </h2>
          <div className="h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className="rounded-2xl p-6 shadow-xl text-white w-[380px]"
            style={{ backgroundColor: "#111A2B" }}
          >
            <h2 className="text-xl font-bold mb-4">
              {tradeType.toUpperCase()} {coin.name}
            </h2>

            <p className="text-gray-300">
              Current Price: ${coin.current_price}
            </p>

            {/* ✅ TOTAL (ADDED ONLY THIS) */}
            <p className="text-gray-300 mt-1">
              Total: ${(quantity * coin.current_price).toFixed(2)}
            </p>
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity || ""}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
            />

            {otpStep && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-4 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
                />

                <div className="mt-2 text-sm text-gray-400">
                  {timer > 0 ? (
                    <span>OTP expires in {timer}s</span>
                  ) : (
                    <span className="text-red-400">OTP expired</span>
                  )}
                </div>

                {canResend && (
                  <button
                    onClick={handleResendOtp}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Resend OTP
                  </button>
                )}
              </>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setOtp("");
                  setOtpStep(false);
                  setTimer(30);
                  setCanResend(false);
                }}
                className="px-4 py-2 border border-white/30 rounded-lg"
              >
                Cancel
              </button>

              {!otpStep ? (
                <button
                  onClick={handleTrade}
                  className={`px-4 py-2 rounded-lg ${tradeType === "buy"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  Send OTP
                </button>
              ) : (
                <button
                  onClick={confirmOtpAndTrade}
                  disabled={timer === 0}
                  className={`px-4 py-2 rounded-lg ${timer === 0
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  Verify & Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinDetails;