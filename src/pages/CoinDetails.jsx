import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PriceChart from "../components/PriceChart";
import Loader from "../components/Loader";

export default function CoinDetails() {
  const { id } = useParams();

  const [coin, setCoin] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const coinRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
        );
        if (!coinRes.ok) throw new Error("Coin API failed");
        const coinData = await coinRes.json();

        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`
        );
        if (!chartRes.ok) throw new Error("Chart API failed");
        const chartData = await chartRes.json();

        setCoin(coinData);
        setPrices(chartData.prices || []);
      } catch (err) {
        setError("Failed to load coin details. Try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!coin) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6 text-[#0b2545]">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          {coin.image?.large && (
            <img
              src={coin.image.large}
              alt={coin.name}
              className="w-16 h-16"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{coin.name}</h1>
            <p className="text-gray-600 uppercase">{coin.symbol}</p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#0f172a] border border-[#c7ddff] dark:border-[#1c2940] p-5 rounded-xl">
            <p className="text-gray-600 dark:text-gray-300">Current Price</p>
            <p className="text-xl font-bold text-black dark:text-white">
              ${coin.market_data?.current_price?.usd ?? "N/A"}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] border border-[#c7ddff] dark:border-[#1c2940] p-5 rounded-xl">
            <p className="text-gray-600 dark:text-gray-300">Market Cap</p>
            <p className="text-xl font-bold text-black dark:text-white">
              $
              {coin.market_data?.market_cap?.usd
                ? coin.market_data.market_cap.usd.toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] border border-[#c7ddff] dark:border-[#1c2940] p-5 rounded-xl">
            <p className="text-gray-600 dark:text-gray-300">24h Change</p>
            <p
              className={`text-xl font-bold ${
                coin.market_data?.price_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {coin.market_data?.price_change_percentage_24h?.toFixed(2) ?? 0}%
            </p>
          </div>
        </div>

        {/* ABOUT */}
        <div className="bg-white dark:bg-[#0f172a] border border-[#c7ddff] dark:border-[#1c2940] p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">
            About {coin.name}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {coin.description?.en
              ? coin.description.en.slice(0, 400) + "..."
              : "No description available."}
          </p>
        </div>

        {/* CHART */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            24 Hour Price Chart
          </h2>
          <PriceChart prices={prices} />
        </div>

      </div>
    </div>
  );
}
