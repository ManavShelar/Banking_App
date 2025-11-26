import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header(){
  const nav = useNavigate();
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    nav('/');
  };

  return (
    <header className="bg-linear-to-r from-white/80 to-sky-50/60 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-linear-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-extrabold shadow-soft">
              B
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-800 leading-tight">Banking App</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {role === 'customer' && (
              <Link to="/transactions" className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-md text-sm font-medium border border-emerald-200">My Transactions</Link>
            )}
            {role === 'banker' && (
              <Link to="/banker/accounts" className="px-3 py-1.5 bg-sky-100 text-sky-800 rounded-md text-sm font-medium border border-sky-200">Accounts</Link>
            )}

            {!role && (
              <>
                <Link to="/customer-login" className="text-m text-black hover:text-slate-900 px-3 py-1 border-amber-700">Customer</Link>
                <Link to="/banker-login" className="text-m  text-black hover:text-slate-900 px-3 py-1 ">Banker</Link>
              </>
            )}

            {role && (
              <button onClick={logout} className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 hover:bg-slate-50">Logout</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
