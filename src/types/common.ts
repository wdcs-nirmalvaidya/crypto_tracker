// ================= COIN LIST =================

export interface Coin {
  id: string;
  name: string;
  image: string;
  current_price: number;
}

// ================= COIN DETAILS =================

export interface CoinDetailsData {
  id: string;
  name: string;
  image: string;
  current_price: number;
  change_24h?: number;
}

// ================= CHART =================

export interface PricePoint {
  timestamp: number;
  price: number;
}

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
  year_established: string;
  trust_score: string;
  trade_volume_24h_btc: string;
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