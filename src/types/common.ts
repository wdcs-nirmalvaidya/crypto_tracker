// COIN TYPES
export interface Coin {
  id: string;
  name: string;
  image: string;
  current_price: number;
}

export interface CoinDetailsData {
  id: string;
  name: string;
  symbol: string;
  image?: {
    large?: string;
  };
  description?: {
    en?: string;
  };
  market_data?: {
    current_price?: {
      usd?: number;
    };
    market_cap?: {
      usd?: number;
    };
    price_change_percentage_24h?: number;
  };
}

// CHART
export type PricePoint = [number, number];

// PAGINATION
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


// ================= PROFILE =================

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
}

// ================= EXCHANGES LIST =================

export interface Exchange {
  id: string;
  name: string;
  image: string;
  country: string | null;
  trust_score_rank: number;
}

// ================= EXCHANGE DETAILS =================

export interface ExchangeDetailsData {
  id: string;
  name: string;
  image: string;
  country: string | null;
  year_established: number | null;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number | null;
  url: string;
}
