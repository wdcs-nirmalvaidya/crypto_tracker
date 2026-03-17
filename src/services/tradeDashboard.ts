import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/trade`;

export const getTradeUser = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`);
  return res.json();
};    