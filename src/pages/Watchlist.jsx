import { useEffect, useState } from "react";
import { getWatchlist } from "../services/watchlist";
import CoinCard from "../components/CoinCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

const ITEMS_PER_PAGE = 12;

export default function Watchlist() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch watchlist
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
        setCoins(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load watchlist", err);
        setCoins([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, []);

  // ✅ Pagination calculations
  const totalPages = Math.ceil(coins.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCoins = coins.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ✅ FIX: keep page valid when coins change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ⛔ RETURNS MUST COME AFTER ALL HOOKS
  if (loading) return <Loader />;

  return (
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
        <>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </div>

          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
