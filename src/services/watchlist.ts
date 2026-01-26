const KEY = "watchlist";

/* ---------------- Helpers ---------------- */

export function getWatchlist(): string[] {
  const data = localStorage.getItem(KEY);

  try {
    return data ? (JSON.parse(data) as string[]) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(id: string): void {
  const list = getWatchlist();

  if (!list.includes(id)) {
    localStorage.setItem(
      KEY,
      JSON.stringify([...list, id])
    );
  }
}

export function removeFromWatchlist(id: string): void {
  const list = getWatchlist().filter(
    (coinId) => coinId !== id
  );

  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().includes(id);
}
