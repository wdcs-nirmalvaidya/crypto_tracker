import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "../components/Pagination";
import { Exchange } from "../types/common";
import { API_BASE_URL } from "../config";

const ITEMS_PER_PAGE = 12;

const Exchanges = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 🔎 Get search from URL
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  useEffect(() => {
    fetchExchanges();
  }, [location.search]); // 🔥 refetch when search changes

  const fetchExchanges = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/exchanges?search=${search}`
      );

      if (!res.ok) {
        throw new Error("Failed to load exchanges");
      }

      const data = await res.json();
      setExchanges(data);
    } catch {
      setError("Failed to load exchanges");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_BASE_URL}/exchanges/${id}`, {
      method: "DELETE",
    });
    fetchExchanges();
  };

  const handleEdit = (exchange: Exchange) => {
    navigate("/add-exchange", { state: { exchange } });
  };

  // 🔥 Pagination (no frontend filtering anymore)
  const totalPages = Math.ceil(
    exchanges.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedExchanges = exchanges.slice(
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
            Exchanges
          </h1>

          <button
            onClick={() => navigate("/add-exchange")}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            + Add Exchange
          </button>
        </div>

        {exchanges.length === 0 ? (
          <p className="text-gray-600">
            No matching exchanges found
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedExchanges.map((ex) => (
                <div key={ex.id} className="relative group">

                  <div
                    onClick={() => navigate(`/exchange/${ex.id}`)}
                    className="
                      bg-white text-black border border-gray-200
                      dark:bg-[#111A2B] dark:text-white dark:border-[#111A2B]
                      rounded-2xl shadow-lg relative p-6
                      cursor-pointer hover:scale-[1.03]
                      transition duration-300
                      flex flex-col items-center text-center
                    "
                  >
                    <img
                      src={ex.image}
                      alt={ex.name}
                      className="w-16 h-16 object-contain mb-4"
                    />

                    <h2 className="text-lg font-semibold">
                      {ex.name}
                    </h2>

                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition duration-200">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(ex);
                        }}
                        className="
                          bg-gray-100 text-yellow-600 text-xs px-2 rounded
                          dark:bg-[#1c2940] dark:text-yellow-400
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ex.id);
                        }}
                        className="
                          bg-gray-100 text-red-600 text-xs px-2 rounded
                          dark:bg-[#1c2940] dark:text-red-400
                        "
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

export default Exchanges;
