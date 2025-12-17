import { useEffect, useState } from "react";
import CoinCard from "../components/CoinCard";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCoins();
  }, []);

  async function fetchCoins() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1"
      );

      if (!res.ok) {
        throw new Error("API limit exceeded");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setCoins(data);
      } else {
        setCoins([]);
        setError("API limit reached. Please try again later.");
      }
    } catch (err) {
      setError("Failed to load data. Try again later.");
      setCoins([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    /* FULL WHITE PAGE */
    <div className="w-full px-8 py-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#0b1320]">
        Market Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {coins.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
}
