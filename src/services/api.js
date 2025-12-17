const BASE_URL = "https://api.coingecko.com/api/v3";

/* =========================
   HOME PAGE (MARKET DATA)
========================= */
export async function getMarketCoins() {
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
export async function getCoinDetails(id) {
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
export async function getCoinChart(id) {
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
export async function getExchanges() {
  const res = await fetch(`${BASE_URL}/exchanges`);

  if (!res.ok) {
    throw new Error("Failed to fetch exchanges");
  }

  return res.json();
}

/* =========================
   WATCHLIST (MULTI-COIN)
========================= */
export async function getWatchlistCoins(ids) {
  if (!ids || ids.length === 0) return [];

  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(",")}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch watchlist coins");
  }

  return res.json();
}
