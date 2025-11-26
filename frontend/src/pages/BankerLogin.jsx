import React, { useState } from "react";
import { login } from "../api.jsx";
import { useNavigate } from "react-router-dom";

export default function BankerLogin() {
  const [usernameOrEmail, setUE] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    const res = await login(usernameOrEmail, password);
    if (res?.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      nav("/banker/accounts");
    } else {
      setErr(res?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card-glass shadow-soft rounded-xl p-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            Banker Login
          </h2>
          <p className="text-sm text-slate-500 mt-1"></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-slate-600">Email</label>
          <input
            value={usernameOrEmail}
            onChange={(e) => setUE(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-200"
            placeholder="banker1 or bankerone@gmail.com"
          />

          <label className="block text-sm text-slate-600">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-200"
            placeholder="••••••"
          />

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="px-5 py-3 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700"
            >
              Sign in
            </button>
          </div>

          {err && <div className="text-red-600 text-sm font-medium">{err}</div>}
        </form>
      </div>
    </div>
  );
}
