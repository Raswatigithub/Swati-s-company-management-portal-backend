import React from 'react';

export default function StatCard({ label, value, icon, color }) {
    return (
        <div className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}>{icon}</div>
            <div>
                <div className="text-sm text-slate-400">{label}</div>
                <div className="text-3xl font-bold text-white">{value ?? '—'}</div>
            </div>
        </div>
    );
}
