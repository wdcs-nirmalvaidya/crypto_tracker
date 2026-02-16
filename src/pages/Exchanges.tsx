import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { Exchange } from "../types/common";

const ITEMS_PER_PAGE = 12;

interface CustomExchange extends Exchange {
  isCustom?: boolean;
}

const Exchanges = () => {
  const navigate = useNavigate();

  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [customExchanges, setCustomExchanges] = useState<CustomExchange[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchExchanges();

    const stored = JSON.parse(
      localStorage.getItem("customExchanges") || "[]"
    );

    setCustomExchanges(stored);
  }, []);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/exchanges");

      if (!res.ok) {
        throw new Error("API limit exceeded");
      }

      const data: unknown = await res.json();
      setExchanges(Array.isArray(data) ? (data as Exchange[]) : []);
    } catch {
      setError("Failed to load exchanges");
      setExchanges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = customExchanges.filter(
      (ex) => ex.id !== id
    );

    localStorage.setItem(
      "customExchanges",
      JSON.stringify(updated)
    );

    setCustomExchanges(updated);
  };

  const handleEdit = (exchange: CustomExchange) => {
    navigate("/add-exchange", { state: { exchange } });
  };

  const allExchanges = [...customExchanges, ...exchanges];

  const totalPages = Math.ceil(
    allExchanges.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedExchanges = allExchanges.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Loading exchanges...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg font-medium text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-blue-900">
            Exchanges
          </h1>

          <button
            onClick={() => navigate("/add-exchange")}
            className="bg-blue-700 hover:bg-blue-800
                       text-white px-5 py-2 rounded-lg 
                       shadow-md transition duration-300 font-medium"
          >
            + Add Exchange
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedExchanges.map((ex: any) => {
            const isCustom = customExchanges.some(
              (c) => c.id === ex.id
            );

            return (
              <div key={ex.id} className="relative group">

                {/* CARD */}
                <div
                  onClick={() => navigate(`/exchange/${ex.id}`)}
                  className="
                    relative cursor-pointer
                    rounded-2xl p-6
                    shadow-md hover:shadow-xl hover:scale-[1.02]
                    transition duration-300
                    bg-white text-[#0b1320] border border-gray-200
                    dark:bg-[#0b1320] dark:text-white dark:border-[#0b1320]
                  "
                >
                  {/* Small RIGHT Buttons (Custom Only) */}
                  {isCustom && (
                    <div className="absolute top-2 right-2 flex gap-1
                                    opacity-0 group-hover:opacity-100
                                    transition duration-200">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(ex);
                        }}
                        className="px-2 py-0.5 text-[10px] font-medium
                                   rounded
                                   bg-white
                                   text-yellow-600
                                   border border-yellow-400
                                   hover:bg-yellow-500 hover:text-white
                                   transition duration-200 shadow-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ex.id);
                        }}
                        className="px-2 py-0.5 text-[10px] font-medium
                                   rounded
                                   bg-white
                                   text-red-600
                                   border border-red-400
                                   hover:bg-red-600 hover:text-white
                                   transition duration-200 shadow-sm"
                      >
                        Delete
                      </button>

                    </div>
                  )}

                  {/* Logo + Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white flex items-center justify-center">
                      <img
                        src={ex.image}
                        alt={ex.name}
                        className="w-6 h-6 object-contain"
                      />
                    </div>

                    <h2 className="font-semibold text-lg">
                      {ex.name}
                    </h2>
                  </div>

                  {/* Details */}
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Country: {ex.country || "N/A"}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Trust Score Rank: {ex.trust_score_rank || "N/A"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </div>
  );
};

export default Exchanges;
