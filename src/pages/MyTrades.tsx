import { useEffect, useState } from "react";
import { getTradeUser } from "../services/tradeDashboard";

const MyTrades = () => {
  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [balanceType, setBalanceType] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState<number>();

  // 🔥 Message state
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

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

  /* 🔥 Confirm Balance Update */
  const confirmUpdateBalance = async () => {
    if (!amount || amount <= 0) {
      setMessage("Please enter valid amount");
      setIsError(true);
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
            type: balanceType,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        setIsError(true); // 🔴 error
        return;
      }

      setBalance(data.balance);
      setMessage(data.message);
      setIsError(false); // 🟢 success

      setShowPopup(false);
      setAmount(0);

      // Auto hide after 2 seconds
      setTimeout(() => setMessage(""), 5000);

    } catch (err) {
      console.error(err);
      setMessage("Balance update failed");
      setIsError(true);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-white px-10 py-10">
      <h1 className="text-3xl font-bold mb-8">My Trades</h1>

      {/* 🔥 MESSAGE BOX */}
      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded-lg font-medium ${
            isError
              ? "bg-red-100 text-red-700 border border-red-400"
              : "bg-green-100 text-green-700 border border-green-400"
          }`}
        >
          {message}
        </div>
      )}

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
            onClick={() => {
              setBalanceType("add");
              setShowPopup(true);
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold"
          >
            +
          </button>

          <button
            onClick={() => {
              setBalanceType("subtract");
              setShowPopup(true);
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold"
          >
            -
          </button>
        </div>
      </div>

      {/* 🔥 PORTFOLIO */}
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

      {/* 🔥 BALANCE POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className="rounded-2xl p-6 shadow-xl text-white w-[380px]"
            style={{ backgroundColor: "#111A2B" }}
          >
            <h2 className="text-xl font-bold mb-4">
              {balanceType === "add"
                ? "Add Balance"
                : "Withdraw Balance"}
            </h2>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white outline-none"
            />

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setAmount(0);
                }}
                className="px-4 py-2 border border-white/30 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmUpdateBalance}
                className={`px-4 py-2 rounded-lg ${
                  balanceType === "add"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrades;