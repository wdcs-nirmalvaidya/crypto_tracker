import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExchangeDetailsData } from "../types/common";
import { API_BASE_URL } from "../config";

const ExchangeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exchange, setExchange] =
    useState<ExchangeDetailsData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadExchange = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/exchanges/${id}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch exchange");
        }

        const data = await res.json();
        setExchange(data);
      } catch (err) {
        console.error("Exchange details error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadExchange();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1320] text-white">
        Loading...
      </div>
    );

  if (!exchange)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1320] text-white">
        Exchange not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b1320] text-white transition duration-300">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* 🔥 Back Link (Left Side) */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/exchanges")}
            className="text-blue-400 hover:text-blue-500 transition text-sm"
          >
            ← Back to Exchanges
          </button>
        </div>

        {/* Centered Logo + Name */}
        <div className="flex flex-col items-center text-center mb-14">

          <img
            src={exchange.image}
            alt={exchange.name}
            className="w-24 h-24 object-contain mb-4"
          />

          <h1 className="text-3xl font-bold">
            {exchange.name}
          </h1>

        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="bg-[#111A2B] rounded-2xl p-6 shadow-md">
            <p className="text-sm opacity-70 mb-1">
              Year Established
            </p>
            <p className="text-xl font-semibold">
              {exchange.year_established}
            </p>
          </div>

          <div className="bg-[#111A2B] rounded-2xl p-6 shadow-md">
            <p className="text-sm opacity-70 mb-1">
              Trust Score
            </p>
            <p className="text-xl font-semibold">
              {exchange.trust_score}
            </p>
          </div>

          <div className="bg-[#111A2B] rounded-2xl p-6 shadow-md">
            <p className="text-sm opacity-70 mb-1">
              24h Trade Volume (BTC)
            </p>
            <p className="text-xl font-semibold">
              {exchange.trade_volume_24h_btc}
            </p>
          </div>

          <div className="bg-[#111A2B] rounded-2xl p-6 shadow-md">
            <p className="text-sm opacity-70 mb-1">
              Trust Score Rank
            </p>
            <p className="text-xl font-semibold">
              #{exchange.trust_score_rank}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ExchangeDetails;
