import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TradePage from './pages/TradePage';
import PortfolioPage from './pages/PortfolioPage';

function App() {
  const navLinkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-gray-900 text-white'
        : 'text-gray-700 hover:bg-gray-200 hover:text-black'
    }`;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Stock Trading Sim</h1>
            <div className="flex space-x-4">
              <NavLink to="/" className={navLinkClasses} end>
                Market
              </NavLink>
              <NavLink to="/trade" className={navLinkClasses}>
                Trade
              </NavLink>
              <NavLink to="/portfolio" className={navLinkClasses}>
                Portfolio
              </NavLink>
            </div>
          </nav>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </main>

        <footer className="text-center py-4 mt-8 text-gray-500 text-sm">
          Audyence SE Assessment
        </footer>
      </div>
    </Router>
  );
}

export default App;