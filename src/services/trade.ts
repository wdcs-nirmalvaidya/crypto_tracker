import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/trade`;

export const sendOtp = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
};

export const verifyOtp = async (userId: string, otp: string) => {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, otp }),
  });
  return res.json();
};

export const buyCoin = async (
  userId: string,
  coin: string,
  price: number,
  quantity: number
) => {
  const res = await fetch(`${BASE_URL}/buy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, coin, price, quantity }),
  });
  return res.json();
};

export const sellCoin = async (
  userId: string,
  coin: string,
  price: number,
  quantity: number
) => {
  const res = await fetch(`${BASE_URL}/sell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, coin, price, quantity }),
  });
  return res.json();
};
