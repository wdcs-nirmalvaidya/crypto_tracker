import { useEffect, useState } from "react";
import CoinCard from "../components/CoinCard";
import Pagination from "../components/Pagination";
import { Coin } from "../types/common";



const ITEMS_PER_PAGE = 12;

/* ---------------- Types ---------------- */


/* ---------------- Component ---------------- */

const Home = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=48&page=1"
      );

      if (!res.ok) {
        throw new Error("API limit exceeded");
      }

      const data: unknown = await res.json();

      if (Array.isArray(data)) {
        setCoins(data as Coin[]);
      } else {
        setCoins([]);
        setError("API limit reached. Please try again later.");
      }
    } catch {
      setError("Failed to load data. Try again later.");
      setCoins([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔢 Pagination logic
  const totalPages = Math.ceil(coins.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedCoins = coins.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="w-full px-8 py-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-[#0b1320]">
        Market Overview
      </h1>

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
    </div>
  );
};  

export default Home;
