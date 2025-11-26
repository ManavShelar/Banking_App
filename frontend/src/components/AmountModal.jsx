import React, { useState, useEffect } from 'react';

export default function AmountModal({ open, onClose, onSubmit, action }) {
  const [amount, setAmount] = useState('');
  useEffect(()=> { if (!open) setAmount(''); }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-96 bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{action === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</h3>
            <p className="text-sm text-slate-500 mt-1">Enter an amount to {action}. Withdrawals will fail if funds are insufficient.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <label className="block text-sm text-slate-700 mt-4">Amount</label>
        <input type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-2 w-full border border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-indigo-200" />

        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-2 rounded-md border border-slate-200">Cancel</button>
          <button onClick={() => onSubmit(Number(amount))} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Confirm</button>
        </div>
      </div>
    </div>
  );
}
