import { useEffect, useState } from "react";
import { getWatchlist } from "../services/watchlist";
import CoinCard from "../components/CoinCard";
import Loader from "../components/Loader";

export default function Watchlist() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWatchlist() {
      const ids = getWatchlist();

      if (ids.length === 0) {
        setCoins([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(
            ","
          )}`
        );

        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Failed to load watchlist", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, []);

  if (loading) return <Loader />;

  return (
    /* FULL WHITE PAGE */
    <div className="w-full min-h-screen bg-white px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-yellow-500 text-3xl">⭐</span>
        <h1 className="text-2xl font-bold text-[#0b1320]">
          My Watchlist
        </h1>
      </div>

      {/* Content */}
      {coins.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-gray-500">
          <p className="text-xl">Your watchlist is empty</p>
          <p className="text-sm mt-4">
            Click ❤️ on any coin to add it here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {coins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      )}
    </div>
  );
}
