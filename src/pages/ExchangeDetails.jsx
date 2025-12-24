import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ExchangeDetails() {
  const { id } = useParams();
  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExchange() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/exchanges/${id}`
        );
        const data = await res.json();
        setExchange(data);
      } catch (err) {
        console.error("Exchange details error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExchange();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-gray-600 text-lg mt-10">
        Loading exchange details...
      </p>
    );
  }

  if (!exchange) return null;

  return (
    /* ✅ PAGE ALWAYS WHITE (LIGHT + DARK) */
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <img
            src={exchange.image}
            alt={exchange.name}
            className="w-16 h-16"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {exchange.name}
            </h1>
            <p className="text-gray-500">
              {exchange.country || "Global"}
            </p>
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* CARD */}
          <div className="bg-white border border-gray-200 dark:bg-[#0f172a] dark:border-[#1c2940] rounded-xl p-6">
            <p className="text-sm text-gray-500 dark:text-blue-300 mb-1">
              Year Established
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {exchange.year_established || "N/A"}
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white border border-gray-200 dark:bg-[#0f172a] dark:border-[#1c2940] rounded-xl p-6">
            <p className="text-sm text-gray-500 dark:text-blue-300 mb-1">
              Trust Score
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {exchange.trust_score}
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white border border-gray-200 dark:bg-[#0f172a] dark:border-[#1c2940] rounded-xl p-6">
            <p className="text-sm text-gray-500 dark:text-blue-300 mb-1">
              24h Trade Volume (BTC)
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {exchange.trade_volume_24h_btc
                ? exchange.trade_volume_24h_btc.toFixed(2)
                : "N/A"}
            </p>
          </div>
          
          {/* CARD */}
          <div className="bg-white border border-gray-200 dark:bg-[#0f172a] dark:border-[#1c2940] rounded-xl p-6">
            <p className="text-sm text-gray-500 dark:text-blue-300 mb-1">
              Rank
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              #{exchange.trust_score_rank}
            </p>
          </div>

        </div>

        {/* WEBSITE */}
        {exchange.url && (
          <div className="mt-8">
            <a
              href={exchange.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              Visit Official Website →
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
