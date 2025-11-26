import React, { useEffect, useState } from 'react';
import { getTransactions, deposit, withdraw } from '../api.jsx';
import AmountModal from '../components/AmountModal.jsx';
import { useNavigate } from 'react-router-dom';

export default function TransactionsPage(){
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState('deposit');
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(()=>{
    const role = localStorage.getItem('role');
    if (role !== 'customer') nav('/');
    fetchData();
  }, []);

  async function fetchData(){
    setError('');
    const res = await getTransactions();
    if (res.account) {
      setAccount(res.account);
      setTransactions(res.transactions || []);
    } else {
      setError(res.message || 'Failed to fetch');
    }
  }

  function openModal(type) {
    setAction(type);
    setModalOpen(true);
    setError('');
  }

  async function submit(amount) {
    setError('');
    let res;
    if (action === 'deposit') res = await deposit(amount);
    else res = await withdraw(amount);

    if (res?.message && res.message.toLowerCase().includes('insufficient')) {
      setError('Insufficient Funds');
    } else if (res?.balance !== undefined) {
      await fetchData();
      setModalOpen(false);
    } else {
      setError(res?.message || 'Operation failed');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 card-glass p-6 rounded-xl shadow-soft">
        <h3 className="text-lg font-semibold text-slate-700">Account Summary</h3>
        <div className="mt-4">
          <div className="text-sm text-slate-500">Available Balance</div>
          <div className="mt-3 text-4xl font-extrabold text-slate-900">{account ? account.balance : '—'}</div>

          <div className="mt-10 flex gap-3">
            <button onClick={()=>openModal('deposit')} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow hover:from-emerald-600">Deposit</button>
            <button onClick={()=>openModal('withdraw')} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-linear-to-r from-rose-500 to-rose-600 text-white shadow hover:from-rose-600">Withdraw</button>
          </div>

          {error && <div className="mt-4 text-sm text-red-600 font-medium">{error}</div>}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-700">Transaction History</h3>
          <div className="text-sm text-slate-500">Latest first</div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">Balance</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">When</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {transactions.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No transactions yet.</td></tr>
              )}
              {transactions.map(tx => (
                <tr key={tx._id}>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{tx.amount}</td>
                  <td className="px-4 py-3 text-sm">{tx.balance_after}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AmountModal open={modalOpen} onClose={()=>setModalOpen(false)} onSubmit={submit} action={action} />
    </div>
  );
}
