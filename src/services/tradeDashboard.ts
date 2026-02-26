const BASE_URL = "http://localhost:5002/api/trade";

export const getTradeUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`);
  return res.json();
};    