import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AddExchange = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editingExchange = location.state?.exchange;

  const [exchange, setExchange] = useState({
    name: editingExchange?.name || "",
    country: editingExchange?.country || "",
    url: editingExchange?.url || "",
    image: editingExchange?.image || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExchange({
      ...exchange,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          country: exchange.country,
          url: exchange.url,
          image: exchange.image,
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
          {editingExchange ? "Edit Exchange" : "Add Exchange"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <input
            type="text"
            name="name"
            placeholder="Exchange Name"
            value={exchange.name}
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

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={exchange.country}
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

          <input
            type="text"
            name="url"
            placeholder="Website URL"
            value={exchange.url}
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

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={exchange.image}
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
            {editingExchange ? "Update Exchange" : "Add Exchange"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExchange;
