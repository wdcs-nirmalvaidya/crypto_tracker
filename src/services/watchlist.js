const KEY = "watchlist";

export function getWatchlist() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function addToWatchlist(id) {
  const list = getWatchlist();
  if (!list.includes(id)) {
    localStorage.setItem(KEY, JSON.stringify([...list, id]));
  }
}

export function removeFromWatchlist(id) {
  const list = getWatchlist().filter((coin) => coin !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isInWatchlist(id) {
  return getWatchlist().includes(id);
}
