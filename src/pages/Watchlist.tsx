import { useEffect, useState } from "react";
import CoinCard from "../components/CoinCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import { Coin } from "../types/common";

const ITEMS_PER_PAGE = 12;

const Watchlist = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/watchlist"
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

  // ✅ REMOVE from watchlist
  const removeFromWatchlist = async (coinId: string) => {
    try {
      await fetch(
        `http://localhost:5000/api/watchlist/${coinId}`,
        { method: "DELETE" }
      );

      // Remove instantly from UI
      setCoins((prevCoins) =>
        prevCoins.filter(
          (coin) => coin.id !== coinId
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

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
      <h1 className="text-3xl font-bold mb-8">
        ⭐ My Watchlist
      </h1>

      {coins.length === 0 ? (
        <p className="text-gray-600">
          Your watchlist is empty
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedCoins.map((coin) => (
              <div
                key={coin.id}
                className="relative"
              >
                <CoinCard coin={coin} />

                {/* ❤️ Remove Button */}
                <button
                  onClick={() =>
                    removeFromWatchlist(
                      coin.id
                    )
                  }
                  className="absolute top-2 right-2 text-xl hover:scale-110 transition"
                >
                  ❤️
                </button>
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
  );
};

export default Watchlist;
