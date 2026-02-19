import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddExchange = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editingExchange = location.state?.exchange;

  const [exchange, setExchange] = useState({
    name: editingExchange?.name || "",
    image: editingExchange?.image || "",
    year_established: editingExchange?.year_established || "",
    trust_score: editingExchange?.trust_score || "",
    trade_volume_24h_btc: editingExchange?.trade_volume_24h_btc || "",
    trust_score_rank: editingExchange?.trust_score_rank || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    image: "",
    year_established: "",
    trust_score: "",
    trade_volume_24h_btc: "",
    trust_score_rank: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numericFields = [
      "year_established",
      "trust_score",
      "trade_volume_24h_btc",
      "trust_score_rank",
    ];

    if (numericFields.includes(name)) {
      if (!/^\d*$/.test(value)) return;

      const maxLengths: any = {
        year_established: 4,
        trust_score: 6,
        trade_volume_24h_btc: 6,
        trust_score_rank: 6,
      };

      if (value.length > maxLengths[name]) return;
    }

    setExchange({
      ...exchange,
      [name]: value,
    });
  };

  const validate = () => {
    let isValid = true;

    const newErrors = {
      name: "",
      image: "",
      year_established: "",
      trust_score: "",
      trade_volume_24h_btc: "",
      trust_score_rank: "",
    };

    if (!exchange.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!exchange.image.trim()) {
      newErrors.image = "Logo URL is required";
      isValid = false;
    }

    const yearNumber = Number(exchange.year_established);

    if (exchange.year_established.length !== 4) {
      newErrors.year_established = "Year must be exactly 4 digits";
      isValid = false;
    } else if (yearNumber > 2026) {
      newErrors.year_established = "Year cannot be after 2026";
      isValid = false;
    }

    if (!exchange.trust_score) {
      newErrors.trust_score = "Trust score is required";
      isValid = false;
    }

    if (!exchange.trade_volume_24h_btc) {
      newErrors.trade_volume_24h_btc = "Trade volume is required";
      isValid = false;
    }

    if (!exchange.trust_score_rank) {
      newErrors.trust_score_rank = "Rank is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const url = editingExchange
        ? `http://localhost:5000/api/exchanges/${editingExchange.id}`
        : "http://localhost:5000/api/exchanges";

      const method = editingExchange ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: exchange.name,
          image: exchange.image,
          year_established: Number(exchange.year_established),
          trust_score: Number(exchange.trust_score),
          trade_volume_24h_btc: Number(exchange.trade_volume_24h_btc),
          trust_score_rank: Number(exchange.trust_score_rank),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save exchange");
      }

      navigate("/exchanges");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-8 bg-white text-[#0b1320] border border-gray-200 transition duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingExchange ? "Edit Exchange" : "Add Exchange"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Exchange Name"
              value={exchange.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <input
              type="text"
              name="image"
              placeholder="Logo URL"
              value={exchange.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Year */}
          <div>
            <input
              type="number"
              name="year_established"
              placeholder="Year Established"
              value={exchange.year_established}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {errors.year_established && (
              <p className="text-red-500 text-sm mt-1">
                {errors.year_established}
              </p>
            )}
          </div>

          {/* Trust Score */}
          <div>
            <input
              type="number"
              name="trust_score"
              placeholder="Trust Score"
              value={exchange.trust_score}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {errors.trust_score && (
              <p className="text-red-500 text-sm mt-1">
                {errors.trust_score}
              </p>
            )}
          </div>

          {/* Volume */}
          <div>
            <input
              type="number"
              name="trade_volume_24h_btc"
              placeholder="24h Trade Volume (BTC)"
              value={exchange.trade_volume_24h_btc}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {errors.trade_volume_24h_btc && (
              <p className="text-red-500 text-sm mt-1">
                {errors.trade_volume_24h_btc}
              </p>
            )}
          </div>

          {/* Rank */}
          <div>
            <input
              type="number"
              name="trust_score_rank"
              placeholder="Trust Score Rank"
              value={exchange.trust_score_rank}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
            {errors.trust_score_rank && (
              <p className="text-red-500 text-sm mt-1">
                {errors.trust_score_rank}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-lg font-medium transition duration-300 shadow-md"
          >
            {editingExchange ? "Update Exchange" : "Add Exchange"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddExchange;
