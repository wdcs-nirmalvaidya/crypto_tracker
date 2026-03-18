import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CoinCard from "../components/CoinCard";
import Pagination from "../components/Pagination";
import { Coin } from "../types/common";
import { API_BASE_URL } from "../config";

const ITEMS_PER_PAGE = 12;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [coins, setCoins] = useState<Coin[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  const fetchCoins = async () => {
    try {
      const res = await fetch(

        `${API_BASE_URL}/coins?search=${search}`

      );

      if (!res.ok) {
        throw new Error("Failed to load coins");
      }

      const data = await res.json();
      setCoins(data);
    } catch {
      setError("Failed to load coins");
    }
  };

  const fetchWatchlist = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/watchlist`);
      const data = await res.json();
      const ids = data.map((coin: any) => coin.id);
      setWatchlistIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setLoading(true);

    fetchCoins().finally(() => setLoading(false));
    fetchWatchlist();

    const interval = setInterval(() => {
      fetchCoins();
    }, 30000);

    return () => clearInterval(interval);
  }, [location.search]);

  const toggleWatchlist = async (coinId: number) => {
    try {
      if (watchlistIds.includes(coinId)) {
        await fetch(
          `${API_BASE_URL}/watchlist/${coinId}`,
          {
            method: "DELETE",
          }
        );
        setWatchlistIds(
          watchlistIds.filter((id) => id !== coinId)
        );
      } else {
        await fetch(
          `${API_BASE_URL}/watchlist`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ coin_id: coinId }),
          }
        );
        setWatchlistIds([...watchlistIds, coinId]);
      }
    } catch (err) {
      console.error("Watchlist error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_BASE_URL}/coins/${id}`, {
      method: "DELETE",
    });
    fetchCoins();
  };

  const handleEdit = (coin: Coin) => {
    navigate("/add-coin", { state: { coin } });
  };

  const handleOpenDetails = (coinId: number) => {
    navigate(`/coin/${coinId}`);
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

  if (loading)
    return <div className="p-10 text-center">Loading...</div>;

  if (error)
    return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-blue-900">
            Market Overview
          </h1>

          <button
            onClick={() => navigate("/add-coin")}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            + Add Coin
          </button>
        </div>

        {coins.length === 0 ? (
          <p className="text-gray-600">
            No matching coins found
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedCoins.map((coin) => (
                <div key={coin.id} className="relative group">

                  <div
                    onClick={() => handleOpenDetails(Number(coin.id))}
                    className="bg-blue-600 text-white rounded-2xl shadow-lg relative cursor-pointer hover:scale-105 transition duration-300"
                  >
                    <CoinCard coin={coin} />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(Number(coin.id));
                      }}
                      className="absolute top-2 right-2 text-xl"
                    >
                      {watchlistIds.includes(Number(coin.id))
                        ? "❤️"
                        : "🤍"}
                    </button>

                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(coin);
                        }}
                        className="bg-white text-yellow-600 text-xs px-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(Number(coin.id));
                        }}
                        className="bg-white text-red-600 text-xs px-2 rounded"
                      >
                        Delete
                      </button>

                    </div>
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

export default Home;