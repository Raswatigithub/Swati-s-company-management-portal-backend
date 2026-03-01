import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { auth } from '../../utils/api';

export default function MyRequests() {
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        fetch(`${API}/client/requests`, { headers: auth() }).then(r => r.json()).then(d => setRequests(Array.isArray(d) ? d : []));
    }, []);

    const statusCls = (s) => s === 'approved' ? 'badge-approved' : s === 'rejected' ? 'badge-rejected' : 'badge-pending';

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">My Requests</h1>
            <p className="text-slate-400 text-sm mb-8">Track the status of all your service requests.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {requests.length === 0 && (
                    <div className="card py-12 text-center col-span-3">
                        <div className="text-4xl mb-3">📋</div>
                        <div className="text-slate-400">No requests submitted yet.</div>
                        <Link to="/client/request" className="btn-primary inline-block mt-4">Submit a Request →</Link>
                    </div>
                )}
                {requests.map(r => (
                    <div key={r._id} className="card p-0 overflow-hidden flex flex-col">
                        {r.service?.image && <img src={r.service.image} alt={r.service.name} className="w-full h-36 object-cover" />}
                        <div className="p-4 flex flex-col gap-2 flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-white">{r.service?.name || 'Service'}</h3>
                                <span className={statusCls(r.status)}>{r.status}</span>
                            </div>
                            {r.description && <p className="text-xs text-slate-400 bg-slate-800/60 rounded-lg px-3 py-2">{r.description}</p>}
                            <div className="text-xs text-slate-600 mt-auto">{new Date(r.createdAt).toLocaleDateString()}</div>
                            {r.status === 'approved' && (
                                <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2">
                                    🎉 Approved! Check <Link to="/client" className="underline">My Projects</Link> for your new project.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
