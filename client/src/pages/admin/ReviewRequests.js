import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API, { auth, jsonAuth } from '../../utils/api';

export default function ReviewRequests() {
    const [requests, setRequests] = useState([]);
    const fetchRequests = () => fetch(`${API}/admin/requests`, { headers: auth() }).then(r => r.json()).then(d => setRequests(Array.isArray(d) ? d : []));
    useEffect(() => { fetchRequests(); }, []);

    const handleAction = async (id, status) => {
        const res = await fetch(`${API}/admin/requests/${id}`, { method: 'PUT', headers: jsonAuth(), body: JSON.stringify({ status }) });
        if (res.ok) {
            if (status === 'approved') toast.success('Approved! A project has been created.');
            else toast.info('Request ' + status);
            fetchRequests();
        }
    };

    const statusCls = (s) => s === 'approved' ? 'badge-approved' : s === 'rejected' ? 'badge-rejected' : 'badge-pending';

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Service Requests</h1>
            <p className="text-slate-400 text-sm mb-8">Approving a request automatically creates a project.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {requests.length === 0 && <p className="text-slate-600">No requests yet.</p>}
                {requests.map(r => (
                    <div key={r._id} className="card p-0 overflow-hidden flex flex-col">
                        {r.service?.image && <img src={r.service.image} alt={r.service.name} className="w-full h-36 object-cover" />}
                        <div className="p-4 flex flex-col gap-3 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-white">{r.service?.name || '(Service deleted)'}</h3>
                                <span className={statusCls(r.status)}>{r.status}</span>
                            </div>
                            <div className="text-xs text-slate-400">
                                <span className="font-medium text-slate-300">{r.client?.name}</span>
                                {r.client?.company && <span className="ml-1 text-slate-500">({r.client.company})</span>}
                            </div>
                            {r.description && (
                                <div className="text-xs text-slate-400 bg-slate-800/60 rounded-lg px-3 py-2">{r.description}</div>
                            )}
                            <div className="text-xs text-slate-600">{new Date(r.createdAt).toLocaleDateString()}</div>
                            {r.status === 'pending' && (
                                <div className="flex gap-2 mt-auto">
                                    <button onClick={() => handleAction(r._id, 'approved')} className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 py-2 rounded-xl text-xs font-semibold transition-all">✅ Approve</button>
                                    <button onClick={() => handleAction(r._id, 'rejected')} className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 py-2 rounded-xl text-xs font-semibold transition-all">❌ Reject</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
