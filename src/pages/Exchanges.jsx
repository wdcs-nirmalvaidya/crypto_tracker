import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Exchanges() {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <p className="text-center text-gray-600 text-lg mt-10">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {exchanges.slice(0, 20).map((ex) => (
          <div
            key={ex.id}
            onClick={() => navigate(`/exchange/${ex.id}`)}
            className="
              cursor-pointer
              h-[280px]
              px-10 py-12
              rounded-xl
              flex flex-col items-center justify-center
              text-center
              shadow-lg
              hover:scale-105 transition

              bg-white
              text-[#0b2545]
              border border-[#e2e8f0]

              dark:bg-gradient-to-br dark:from-[#0b1320] dark:to-[#111a2b]
              dark:text-white
              dark:border-[#1c2940]
            "
          >
            {/* LOGO */}
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4">
              <img
                src={ex.image}
                alt={ex.name}
                className="w-8 h-8 object-contain"
              />
            </div>

            {/* NAME */}
            <h2 className="text-lg font-semibold">
              {ex.name}
            </h2>

            {/* COUNTRY */}
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              {ex.country || "Global"}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}
