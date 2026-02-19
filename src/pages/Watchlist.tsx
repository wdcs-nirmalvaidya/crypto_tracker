import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CoinCard from "../components/CoinCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { Coin } from "../types/common";

const ITEMS_PER_PAGE = 12;

const Watchlist = () => {
  const location = useLocation();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 🔎 Get search from URL
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  useEffect(() => {
    fetchWatchlist();
  }, [location.search]); // 🔥 refetch when search changes

  const fetchWatchlist = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/watchlist?search=${search}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch watchlist");
      }

      const data = await res.json();
      setCoins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (coinId: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/watchlist/${coinId}`,
        { method: "DELETE" }
      );

      // Remove instantly from UI
      setCoins((prevCoins) =>
        prevCoins.filter((coin) => coin.id !== coinId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Pagination (no frontend filtering anymore)
  const totalPages = Math.ceil(
    coins.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedCoins = coins.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl text-blue-900 font-bold mb-8">
          ⭐ My Watchlist
        </h1>

        {coins.length === 0 ? (
          <p className="text-gray-600">
            No matching coins found
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="relative group"
                >

                  <div
                    className="
                      bg-white text-black border border-gray-200
                      dark:bg-[#111A2B] dark:text-white dark:border-[#111A2B]
                      rounded-2xl shadow-lg relative
                      hover:scale-[1.03]
                      transition duration-300
                    "
                  >
                    <CoinCard coin={coin} />

                    <button
                      onClick={() =>
                        removeFromWatchlist(coin.id)
                      }
                      className="absolute top-2 right-2 text-xl hover:scale-110 transition"
                    >
                      ❤️
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Watchlist;
