import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AddCoin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editingCoin = location.state?.coin;

  const [coin, setCoin] = useState({
    name: editingCoin?.name || "",
    current_price: editingCoin?.current_price || "",
    image: editingCoin?.image || "",
  });

  const [errors, setErrors] = useState({
    name: "",
    current_price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoin({
      ...coin,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { name: "", current_price: "" };

    // ✅ Name validation
    const nameRegex = /^[A-Za-z]+$/;

    if (!coin.name) {
      newErrors.name = "Coin name is required";
      isValid = false;
    } else if (!nameRegex.test(coin.name)) {
      newErrors.name = "Only letters allowed";
      isValid = false;
    } else if (coin.name.length > 10) {
      newErrors.name = "Maximum 10 letters allowed";
      isValid = false;
    }

    // ✅ Price validation
    const priceValue = Number(coin.current_price);

    if (!coin.current_price) {
      newErrors.current_price = "Price is required";
      isValid = false;
    } else if (isNaN(priceValue)) {
      newErrors.current_price = "Price must be a number";
      isValid = false;
    } else if (priceValue <= 0) {
      newErrors.current_price = "Price must be greater than 0";
      isValid = false;
    } else if (coin.current_price.toString().length > 10) {
      newErrors.current_price = "Maximum 10 digits allowed";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const url = editingCoin
        ? `${API_BASE_URL}/coins/${editingCoin.id}`
        : `${API_BASE_URL}/coins`;

      const method = editingCoin ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: coin.name,
          current_price: Number(coin.current_price),
          image: coin.image,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save coin");
      }

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10">
      <div
        className="
          w-full max-w-md
          rounded-2xl
          shadow-lg
          p-8
          bg-white text-[#0b1320] border border-gray-200
          dark:bg-[#0b1320] dark:text-white dark:border-[#0b1320]
          transition duration-300
        "
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingCoin ? "Edit Coin" : "Add New Coin"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <input
              type="text"
              name="name"
              placeholder="Coin Name"
              value={coin.name}
              onChange={handleChange}
              required
              className="
                w-full
                border border-gray-300
                rounded-lg
                px-4 py-2
                bg-white text-[#0b1320]
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-[#111a2b] dark:border-[#1c2940] dark:text-white
                transition duration-200
              "
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="current_price"
              placeholder="Price"
              value={coin.current_price}
              onChange={handleChange}
              required
              className="
                w-full
                border border-gray-300
                rounded-lg
                px-4 py-2
                bg-white text-[#0b1320]
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-[#111a2b] dark:border-[#1c2940] dark:text-white
                transition duration-200
              "
            />
            {errors.current_price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.current_price}
              </p>
            )}
          </div>

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={coin.image}
            onChange={handleChange}
            required
            className="
              w-full
              border border-gray-300
              rounded-lg
              px-4 py-2
              bg-white text-[#0b1320]
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:bg-[#111a2b] dark:border-[#1c2940] dark:text-white
              transition duration-200
            "
          />

          <button
            type="submit"
            className="
              w-full
              bg-blue-700 hover:bg-blue-800
              text-white
              py-2.5
              rounded-lg
              font-medium
              transition duration-300
              shadow-md
            "
          >
            {editingCoin ? "Update Coin" : "Add Coin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCoin;
