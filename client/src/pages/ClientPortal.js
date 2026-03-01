import React, { useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import API from '../utils/api';
import Messaging from '../components/Messaging';

import ClientProjects from './client/ClientProjects';
import AvailableServices from './client/AvailableServices';
import MyRequests from './client/MyRequests';
import RequestService from './client/RequestService';
import ClientProfile from './client/ClientProfile';

export default function ClientPortal() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { if (user.role !== 'client') navigate('/login'); }, [user.role, navigate]);

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
    { to: '/client', icon: '📁', label: 'My Projects' },
    { to: '/client/services', icon: '⚡', label: 'Our Services' },
    { to: '/client/requests', icon: '📋', label: 'My Requests' },
    { to: '/client/request', icon: '➕', label: 'New Request' },
    { to: '/client/messages', icon: '💬', label: 'Messages' },
    { to: '/client/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col w-64 shrink-0"
        style={{ background: 'linear-gradient(180deg,#080814 0%,#0a0a1c 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-600 to-blue-500">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="2" fill="white" opacity="0.9" /><rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.6" /><rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.6" /><rect x="13" y="13" width="8" height="8" rx="2" fill="white" opacity="0.3" /></svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Swati Software</div>
              <div className="text-xs text-blue-400">Client Portal</div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-white/5">
          <div className="text-xs text-slate-500">Welcome,</div>
          <div className="text-sm font-medium text-white truncate">{user.name}</div>
          {user.company && <div className="text-xs text-slate-500 truncate">{user.company}</div>}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {links.map(({ to, icon, label }) => {
            const exact = to === '/client';
            const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive ? 'bg-blue-600/20 text-blue-300 border border-blue-500/25' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}>
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

      <div className="flex-1 overflow-auto p-8" style={{ background: 'radial-gradient(ellipse at 80% 0%, #0a1020 0%, #050510 60%)' }}>
        <Routes>
          <Route path="/" element={<ClientProjects />} />
          <Route path="/services" element={<AvailableServices />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/request" element={<RequestService />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/profile" element={<ClientProfile />} />
        </Routes>
      </div>
    </div>
  );
}

