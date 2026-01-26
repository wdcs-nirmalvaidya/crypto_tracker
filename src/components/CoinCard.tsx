import { useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "../services/watchlist";
import { Coin } from "../types/common";


/* ---------------- Types ---------------- */


interface CoinCardProps {
  coin: Coin;
}

/* ---------------- Component ---------------- */

const CoinCard = ({ coin }: CoinCardProps) => {
  const navigate = useNavigate();

  const [liked, setLiked] = useState<boolean>(
    isInWatchlist(coin.id)
  );

  const toggleWatchlist = (
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    liked
      ? removeFromWatchlist(coin.id)
      : addToWatchlist(coin.id);

    setLiked(!liked);
  };

  return (
    <div
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="
        cursor-pointer
        bg-white dark:bg-[#111a2b]
        text-[#0b2545] dark:text-white
        border border-[#c7ddff] dark:border-[#1c2940]
        p-6 rounded-xl shadow
        flex flex-col items-center
        hover:scale-105 transition
        relative
      "
    >
      {/* ❤️ Watchlist */}
      <button
        onClick={toggleWatchlist}
        className={`absolute top-4 right-4 text-2xl ${
          liked
            ? "text-red-500"
            : "text-gray-400 dark:text-gray-300"
        }`}
      >
        ♥
      </button>

      {/* Coin Image */}
      <img
        src={coin.image}
        alt={coin.name}
        className="
          w-16 h-16 mb-4
          bg-[#f5f9ff] dark:bg-white
          rounded-full p-2
        "
      />

      {/* Coin Info */}
      <h2 className="text-lg font-semibold text-center">
        {coin.name}
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        ${coin.current_price}
      </p>
    </div>
  );
};

export default CoinCard;
