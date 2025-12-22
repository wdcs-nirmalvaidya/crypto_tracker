import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 12;

export default function Exchanges() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExchanges();
  }, []);

  async function fetchExchanges() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://api.coingecko.com/api/v3/exchanges?per_page=100&page=1"
      );

      if (!res.ok) {
        throw new Error("API limit exceeded");
      }

      const data = await res.json();
      setExchanges(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load exchanges");
      setExchanges([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔢 Pagination logic
  const totalPages = Math.ceil(exchanges.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedExchanges = exchanges.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) {
    return <p className="p-6 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full px-8 py-6 min-h-screen bg-white transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6 text-[#0b1320]">
        Exchanges
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedExchanges.map((ex) => (
          <div
            key={ex.id}
            onClick={() => navigate(`/exchange/${ex.id}`)}
            className="
              cursor-pointer
              rounded-xl p-5 shadow-md
              transition transform hover:scale-[1.02]

              /* Light mode */
              bg-white text-[#0b1320] border border-gray-200

              /* Dark mode → SAME BLUE AS SCREENSHOT */
              dark:bg-gradient-to-br dark:from-[#0b1320] dark:to-[#111a2b]
              dark:text-white dark:border-[#1c2940]
            "
          >
            {/* LOGO */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#0b1320] flex items-center justify-center">
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

            {/* DETAILS */}
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Country: {ex.country || "N/A"}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Trust Score Rank: {ex.trust_score_rank}
            </p>
          </div>
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
}
