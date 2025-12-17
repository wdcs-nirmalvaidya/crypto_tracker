import { useEffect, useState } from "react";

export default function Exchanges() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/exchanges");
        const data = await res.json();
        setExchanges(data);
      } catch (err) {
        console.error("Exchanges API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading)
    return (
      <p className="text-center text-[#0b2545] dark:text-white text-lg mt-10">
        Loading...
      </p>
    );

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
                    bg-[#eaf3ff] dark:bg-[#0b1320]">
      {exchanges.map((ex) => (
        <div
          key={ex.id}
          className="
            bg-white dark:bg-[#0f172a]
            text-[#0b2545] dark:text-white
            border border-[#c7ddff] dark:border-[#1c2940]
            p-6 rounded-xl shadow-lg
            flex flex-col items-center
            hover:scale-105 transition
          "
        >
          <img
            src={ex.image}
            alt={ex.name}
            className="w-20 h-20 object-contain mb-4"
          />

          <h2 className="text-xl font-semibold mb-1">
            {ex.name}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Country:{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {ex.country || "N/A"}
            </span>
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Since:{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {ex.year_established || "Unknown"}
            </span>
          </p>

          <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
            Trust Score:{" "}
            <span className="font-bold">{ex.trust_score}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
