import React, { useState, useEffect } from 'react';
import API, { auth } from '../../utils/api';
import StatCard from './StatCard';

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    useEffect(() => {
        fetch(`${API}/admin/stats`, { headers: auth() }).then(r => r.json()).then(setStats);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400 text-sm mb-8">Welcome back, Admin. Here's an overview.</p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Total Projects" value={stats.projectCount} icon="📁" color="bg-brand-600/20 text-brand-400" />
                <StatCard label="Employees" value={stats.employeeCount} icon="👥" color="bg-emerald-500/20 text-emerald-400" />
                <StatCard label="Clients" value={stats.clientCount} icon="🏢" color="bg-blue-500/20 text-blue-400" />
                <StatCard label="Messages" value={stats.messageCount} icon="💬" color="bg-purple-500/20 text-purple-400" />
            </div>
        </div>
    );
}
