import React, { useEffect, useState } from "react";
import { getAccounts, getUserTransactions } from "../api.jsx";
import { useNavigate } from "react-router-dom";

export default function BankerAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedTx, setSelectedTx] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "banker") nav("/");
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setError("");
    const res = await getAccounts();
    if (res.accounts) setAccounts(res.accounts);
    else setError(res.message || "Failed to load accounts");
  }

  async function viewTransactions(userId) {
    setError("");
    const res = await getUserTransactions(userId);
    if (res.transactions) {
      setSelectedTx(res.transactions);
      setSelectedAccount(res.account);
    } else {
      setError(res.message || "Failed to load transactions");
    }
  }

  const filtered = accounts.filter((a) => {
    const uname = a.user_id?.username?.toLowerCase() || "";
    const email = a.user_id?.email?.toLowerCase() || "";
    return uname.includes(q.toLowerCase()) || email.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="bg-white card-glass rounded-xl p-6 shadow-soft flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Customer Accounts
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {filtered.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-lg p-4 flex items-center justify-between shadow"
            >
              <div>
                <div className="font-medium text-slate-800">
                  {a.user_id?.username}
                </div>
                <div className="text-xs text-slate-500">{a.user_id?.email}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{a.balance}</div>
                <button
                  onClick={() => viewTransactions(a.user_id._id)}
                  className="mt-2 px-3 py-1 rounded bg-sky-600 text-white text-xs"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-soft">
          <h4 className="text-md font-semibold mb-4">Transactions</h4>
          {!selectedAccount && (
            <div className="text-sm text-slate-500">
              Select a user to view transactions.
            </div>
          )}

          {selectedAccount && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {selectedAccount.user_id?.username}
                  </div>
                  <div className="text-sm text-slate-500">
                    {selectedAccount.user_id?.email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Balance</div>
                  <div className="text-2xl font-bold">
                    {selectedAccount.balance}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">
                        Balance After
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {selectedTx.map((tx) => (
                      <tr key={tx._id}>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              tx.type === "deposit"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">{tx.amount}</td>
                        <td className="px-4 py-3">{tx.balance_after}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-3 text-red-600 font-medium">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
