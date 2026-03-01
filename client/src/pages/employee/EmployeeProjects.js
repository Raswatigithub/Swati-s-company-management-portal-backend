import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API, { auth, jsonAuth } from '../../utils/api';

export default function EmployeeProjects() {
    const [projects, setProjects] = useState([]);

    const fetchProjects = () =>
        fetch(`${API}/employee/projects`, { headers: auth() }).then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : []));

    useEffect(() => { fetchProjects(); }, []);

    const updateStatus = async (id, status) => {
        const res = await fetch(`${API}/employee/projects/${id}`, { method: 'PUT', headers: jsonAuth(), body: JSON.stringify({ status }) });
        if (res.ok) {
            toast.success(`Project status updated to ${status}`);
            fetchProjects();
        } else {
            toast.error('Failed to update status');
        }
    };

    const statusCls = (s) => s === 'completed' ? 'badge-completed' : s === 'active' ? 'badge-active' : 'badge-pending';

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">My Assigned Projects</h1>
            <p className="text-slate-400 text-sm mb-8">Projects assigned to you by the admin.</p>

            {projects.length === 0 && (
                <div className="card text-center py-16">
                    <div className="text-4xl mb-3">📭</div>
                    <div className="text-slate-400">No projects assigned to you yet.</div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects.map(p => (
                    <div key={p._id} className="card p-0 overflow-hidden flex flex-col">
                        {p.image
                            ? <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                            : <div className="w-full h-14 bg-gradient-to-r from-emerald-900 to-slate-900 flex items-center justify-center text-slate-600 text-xs">📁</div>
                        }
                        <div className="p-4 flex flex-col gap-2.5 flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-white leading-tight">{p.name}</h3>
                                <span className={statusCls(p.status)}>{p.status}</span>
                            </div>
                            <p className="text-xs text-slate-400">{p.description}</p>
                            <div className="text-xs text-slate-400">
                                <span className="text-slate-300 font-medium">Client:</span> {p.client?.name}
                                {p.client?.company && <span className="text-slate-500"> ({p.client.company})</span>}
                            </div>
                            <div className="text-xs text-slate-400">
                                <span className="text-slate-300 font-medium">Team:</span>{' '}
                                {(p.assignedEmployees || []).map(e => e.name).join(', ') || '—'}
                            </div>

                            <div className="mt-auto pt-2 border-t border-slate-800">
                                <label className="text-xs text-slate-400 mb-1 block">Update Status</label>
                                <select
                                    className="input-field text-xs py-1.5"
                                    value={p.status}
                                    onChange={e => updateStatus(p._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
