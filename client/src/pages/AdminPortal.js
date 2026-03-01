import React, { useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import API from '../utils/api';
import Messaging from '../components/Messaging';

import AdminDashboard from './admin/AdminDashboard';
import ManageUsers from './admin/ManageUsers';
import ManageServices from './admin/ManageServices';
import ReviewRequests from './admin/ReviewRequests';
import ManageProjects from './admin/ManageProjects';
import AdminProfile from './admin/AdminProfile';

export default function AdminPortal() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { if (user.role !== 'admin') navigate('/login'); }, [user.role, navigate]);

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
    { to: '/admin', icon: '📊', label: 'Dashboard' },
    { to: '/admin/employees', icon: '👥', label: 'Employees' },
    { to: '/admin/clients', icon: '🏢', label: 'Clients' },
    { to: '/admin/services', icon: '⚡', label: 'Services' },
    { to: '/admin/requests', icon: '📋', label: 'Service Requests' },
    { to: '/admin/projects', icon: '📁', label: 'Projects' },
    { to: '/admin/messages', icon: '💬', label: 'Messages' },
    { to: '/admin/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="flex flex-col w-64 shrink-0"
        style={{ background: 'linear-gradient(180deg,#080814 0%,#0a0a1c 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-brand-600 to-brand-500">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M8 24L16 8l8 16H8z" fill="white" opacity="0.9" /><circle cx="16" cy="8" r="3" fill="white" /></svg>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Swati Software</div>
              <div className="text-xs text-brand-400">Admin Portal</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {links.map(({ to, icon, label }) => {
            const exact = to === '/admin';
            const isActive = exact ? location.pathname === to : location.pathname.startsWith(to + '/') || location.pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive ? 'bg-brand-600/25 text-brand-300 border border-brand-500/25' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}>
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

      {/* Main */}
      <div className="flex-1 overflow-auto p-8" style={{ background: 'radial-gradient(ellipse at 80% 0%, #1a0a3a 0%, #050510 60%)' }}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/employees" element={<ManageUsers role="employee" />} />
          <Route path="/clients" element={<ManageUsers role="client" />} />
          <Route path="/services" element={<ManageServices />} />
          <Route path="/requests" element={<ReviewRequests />} />
          <Route path="/projects" element={<ManageProjects />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </div>
  );
}


