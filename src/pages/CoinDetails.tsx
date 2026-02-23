import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

import Loader from "../components/Loader";
import { CoinDetailsData, PricePoint } from "../types/common";

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [coin, setCoin] = useState<CoinDetailsData | null>(null);
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCoinData = async () => {
    try {
      const coinRes = await fetch(
        `http://localhost:5000/api/coins/${id}`
      );
      if (!coinRes.ok) throw new Error();

      const coinData = await coinRes.json();

      const historyRes = await fetch(
        `http://localhost:5000/api/coins/${id}/history`
      );
      if (!historyRes.ok) throw new Error();

      const historyData = await historyRes.json();

      setCoin(coinData);
      setPrices(historyData || []);
    } catch {
      setError("Failed to load coin details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCoinData();
    const interval = setInterval(fetchCoinData, 30000);
    return () => clearInterval(interval);
  }, [id]);

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
      legend: {
        labels: { color: "white" },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* HEADER + BUY SELL */}
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
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition">
              Buy
            </button>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition">
              Sell
            </button>
          </div>
        </div>

        {/* 24H CHANGE CARD */}
        <div
          className="rounded-2xl p-6 shadow-xl mb-8 text-white"
          style={{ backgroundColor: "#111A2B" }}
        >
          <p className="text-gray-300">24h Change</p>

          <p
            className={`text-2xl font-bold ${
              coin.change_24h && coin.change_24h >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {coin.change_24h?.toFixed(2)}%
          </p>
        </div>

        {/* CHART CARD */}
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
    </div>
  );
};

export default CoinDetails;
