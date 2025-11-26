import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import CustomerLogin from './pages/CustomerLogin.jsx';
import BankerLogin from './pages/BankerLogin.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import BankerAccountsPage from './pages/BankerAccountsPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={
            <div className="text-center py-24">
              <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Banking Dashboard</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Login as a customer to manage your transactions or as a banker to view customer accounts</p>
              <div className="mt-8 flex justify-center gap-4">
                <Link to="/customer-login" className="px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700">Customer Login</Link>
                <Link to="/banker-login" className="px-5 py-3 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-700">Banker Login</Link>
              </div>
            </div>
          } />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/banker-login" element={<BankerLogin />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/banker/accounts" element={<BankerAccountsPage />} />
        </Routes>
      </main>
    </div>
  );
}
