

const BASE_URL = "https://dummyjson.com";


export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Invalid username or password");
  }

  return res.json();
}


export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}


export function logoutUser() {
  localStorage.removeItem("token");
}


export function isAuthenticated() {
  return !!getToken();
}
