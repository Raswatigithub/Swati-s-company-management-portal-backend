import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { auth } from '../../utils/api';

export default function ClientProjects() {
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        fetch(`${API}/client/projects`, { headers: auth() }).then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : []));
    }, []);

    const statusCls = (s) => s === 'completed' ? 'badge-completed' : s === 'active' ? 'badge-active' : 'badge-pending';

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">My Projects</h1>
            <p className="text-slate-400 text-sm mb-8">Track all your active projects.</p>
            {projects.length === 0 && (
                <div className="card text-center py-16">
                    <div className="text-4xl mb-3">📭</div>
                    <div className="text-slate-400 mb-3">No projects yet.</div>
                    <Link to="/client/request" className="btn-primary inline-block">Request a Service →</Link>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects.map(p => (
                    <div key={p._id} className="card p-0 overflow-hidden flex flex-col">
                        {p.image
                            ? <img src={p.image} alt={p.name} className="w-full h-44 object-cover" />
                            : <div className="w-full h-16 bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-center text-slate-600 text-xs">📁</div>
                        }
                        <div className="p-4 flex flex-col gap-2.5 flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <h3 className="font-semibold text-white">{p.name}</h3>
                                <span className={statusCls(p.status)}>{p.status}</span>
                            </div>
                            <p className="text-xs text-slate-400 flex-1">{p.description}</p>
                            <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                                <span className="text-slate-300 font-medium">Assigned team: </span>
                                {(p.assignedEmployees || []).map(e => e.name).join(', ') || <span className="text-amber-400">Waiting for assignment</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
