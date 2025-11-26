const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function login(usernameOrEmail, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password })
  });
  return res.json();
}

export async function getTransactions() {
  const res = await fetch(`${API_BASE}/customer/transactions`, { headers: { ...authHeaders() } });
  return res.json();
}
export async function deposit(amount) {
  const res = await fetch(`${API_BASE}/customer/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ amount })
  });
  return res.json();
}
export async function withdraw(amount) {
  const res = await fetch(`${API_BASE}/customer/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ amount })
  });
  return res.json();
}

export async function getAccounts() {
  const res = await fetch(`${API_BASE}/banker/accounts`, { headers: { ...authHeaders() }});
  return res.json();
}
export async function getUserTransactions(userId) {
  const res = await fetch(`${API_BASE}/banker/accounts/${userId}/transactions`, { headers: { ...authHeaders() }});
  return res.json();
}
