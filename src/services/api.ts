const BASE_URL = "https://api.coingecko.com/api/v3";

/* ---------------- Types ---------------- */

export interface MarketCoin {
  id: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export interface CoinDetails {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
  };
}

export interface ChartData {
  prices: [number, number][];
}

export interface Exchange {
  id: string;
  name: string;
  image: string;
  url: string;
  trust_score_rank: number;
}

/* =========================
   HOME PAGE (MARKET DATA)
========================= */
export async function getMarketCoins(): Promise<MarketCoin[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch market data");
  }

  return res.json();
}

/* =========================
   COIN DETAILS PAGE
========================= */
export async function getCoinDetails(
  id: string
): Promise<CoinDetails> {
  const res = await fetch(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch coin details");
  }

  return res.json();
}

/* =========================
   PRICE CHART (7 DAYS)
========================= */
export async function getCoinChart(
  id: string
): Promise<ChartData> {
  const res = await fetch(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch chart data");
  }

  return res.json();
}

/* =========================
   EXCHANGES PAGE
========================= */
export async function getExchanges(): Promise<Exchange[]> {
  const res = await fetch(`${BASE_URL}/exchanges`);

  if (!res.ok) {
    throw new Error("Failed to fetch exchanges");
  }

  return res.json();
}

/* =========================
   WATCHLIST (MULTI-COIN)
========================= */
export async function getWatchlistCoins(
  ids: string[]
): Promise<MarketCoin[]> {
  if (!ids || ids.length === 0) return [];

  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(",")}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch watchlist coins");
  }

  return res.json();
}
