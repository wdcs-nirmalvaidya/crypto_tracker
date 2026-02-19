import { Coin } from "../types/common";

interface CoinCardProps {
  coin: Coin;
}

const CoinCard = ({ coin }: CoinCardProps) => {
  return (
    <div
      className="
        bg-white dark:bg-[#111a2b]
        text-[#0b2545] dark:text-white
        border border-[#c7ddff] dark:border-[#1c2940]
        p-6 rounded-xl shadow
        flex flex-col items-center
        hover:scale-105 transition
        relative
      "
    >
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
