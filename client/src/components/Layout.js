import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar({ title, subtitle, links, onLogout }) {
    const location = useLocation();

    return (
        <div className="flex flex-col w-64 min-h-screen shrink-0"
            style={{ background: 'linear-gradient(180deg, #0d0d1f 0%, #0a0a1a 100%)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Brand */}
            <div className="px-5 py-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                        <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M8 24L16 8l8 16H8z" fill="white" opacity="0.9" /><circle cx="16" cy="8" r="3" fill="white" /></svg>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white leading-tight">Swati Software</div>
                        <div className="text-xs text-slate-500 capitalize">{subtitle}</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-4 mb-2">Menu</div>
                {links.map(({ to, icon, label }) => {
                    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
                    return (
                        <Link key={to} to={to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                            <span className="text-base">{icon}</span>
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/5">
                <button onClick={onLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
                    <span>🚪</span> Sign Out
                </button>
            </div>
        </div>
    );
}

export function PageLayout({ title, subtitle, children, sidebar }) {
    return (
        <div className="flex min-h-screen">
            {sidebar}
            <div className="flex-1 overflow-auto p-8" style={{ background: 'linear-gradient(135deg,#050510 0%,#0a0a1a 100%)' }}>
                {(title || subtitle) && (
                    <div className="mb-8">
                        {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
                        {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
