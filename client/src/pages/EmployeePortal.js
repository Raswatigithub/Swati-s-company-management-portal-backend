import React, { useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import API from '../utils/api';
import Messaging from '../components/Messaging';

import EmployeeProjects from './employee/EmployeeProjects';
import EmployeeProfile from './employee/EmployeeProfile';

export default function EmployeePortal() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { if (user.role !== 'employee') navigate('/login'); }, [user.role, navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    localStorage.clear();
    navigate('/login');
  };

  const links = [
    { to: '/employee', icon: '📁', label: 'My Projects' },
    { to: '/employee/messages', icon: '💬', label: 'Messages' },
    { to: '/employee/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col w-64 shrink-0"
        style={{ background: 'linear-gradient(180deg,#080814 0%,#0a0a1c 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-600 to-emerald-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l9 7-9 13-9-13 9-7z" fill="white" opacity="0.85" /></svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Swati Software</div>
              <div className="text-xs text-emerald-400">Employee Portal</div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-white/5">
          <div className="text-xs text-slate-500">Signed in as</div>
          <div className="text-sm font-medium text-white truncate">{user.name}</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {links.map(({ to, icon, label }) => {
            const exact = to === '/employee';
            const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/25' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}>
                <span>{icon}</span>{label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm">
            🚪 Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8" style={{ background: 'radial-gradient(ellipse at 80% 0%, #0a2010 0%, #050510 60%)' }}>
        <Routes>
          <Route path="/" element={<EmployeeProjects />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/profile" element={<EmployeeProfile />} />
        </Routes>
      </div>
    </div>
  );
}

