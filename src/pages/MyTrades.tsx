import { useEffect, useState } from "react";
import { getTradeUser } from "../services/tradeDashboard";

const MyTrades = () => {
  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tradeUserId = localStorage.getItem("tradeUserId");

  useEffect(() => {
    const fetchData = async () => {
      if (!tradeUserId) return;

      const data = await getTradeUser(tradeUserId);

      setBalance(data.balance);
      setPortfolio(data.portfolio);
      setLoading(false);
    };

    fetchData();
  }, []);

  /* 🔥 Add / Subtract Balance */
  const updateBalance = async (type: "add" | "subtract") => {
    const amount = Number(prompt("Enter amount"));

    if (!amount || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5002/api/trade/update-balance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: tradeUserId,
            amount,
            type,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setBalance(data.balance);

    } catch (err) {
      console.error(err);
      alert("Balance update failed");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-white px-10 py-10">
      <h1 className="text-3xl font-bold mb-8">My Trades</h1>

      {/* 🔥 BALANCE CARD */}
      <div className="bg-[#111A2B] text-white p-6 rounded-2xl shadow-xl flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-300">Available Balance</p>
          <p className="text-3xl font-bold">
            ${balance.toLocaleString()}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => updateBalance("add")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold"
          >
            +
          </button>

          <button
            onClick={() => updateBalance("subtract")}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
          >
            -
          </button>
        </div>
      </div>

      {/* PORTFOLIO */}
      <div className="bg-[#111A2B] text-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl mb-4 font-semibold">Portfolio</h2>

        {portfolio.length === 0 ? (
          <p>No trades yet.</p>
        ) : (
          portfolio.map((coin, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-white/20 py-2"
            >
              <span>{coin.coin}</span>
              <span>{coin.quantity}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTrades;