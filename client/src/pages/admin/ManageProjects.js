import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API, { auth, jsonAuth } from '../../utils/api';

export default function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [assigningId, setAssigningId] = useState(null);
    const [statusEdit, setStatusEdit] = useState({});
    const [saving, setSaving] = useState(false);

    const loadData = async () => {
        const [pRes, eRes] = await Promise.all([
            fetch(`${API}/admin/projects`, { headers: auth() }),
            fetch(`${API}/admin/users`, { headers: auth() })
        ]);
        const pData = await pRes.json();
        const eData = await eRes.json();
        setProjects(Array.isArray(pData) ? pData : []);
        setEmployees(Array.isArray(eData) ? eData.filter(u => u.role === 'employee') : []);
    };

    useEffect(() => { loadData(); }, []);

    const statusCls = (s) =>
        s === 'completed' ? 'badge-completed' : s === 'active' ? 'badge-active' : 'badge-pending';

    const toggleEmployee = async (project, empId) => {
        const current = (project.assignedEmployees || []).map(e => e._id || e);
        const updated = current.includes(empId)
            ? current.filter(id => id !== empId)
            : [...current, empId];
        setSaving(true);
        await fetch(`${API}/admin/projects/${project._id}`, {
            method: 'PUT',
            headers: jsonAuth(),
            body: JSON.stringify({ assignedEmployees: updated })
        });
        setSaving(false);
        loadData();
    };

    const saveStatus = async (project) => {
        const newStatus = statusEdit[project._id];
        if (!newStatus || newStatus === project.status) return;
        setSaving(true);
        await fetch(`${API}/admin/projects/${project._id}`, {
            method: 'PUT',
            headers: jsonAuth(),
            body: JSON.stringify({ status: newStatus })
        });
        setSaving(false);
        loadData();
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Projects</h1>
                <p className="text-slate-400 text-sm mt-1">
                    All projects with full details — assign or unassign employees, update status.
                </p>
            </div>

            {projects.length === 0 && (
                <div className="card flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-4xl mb-4">📁</div>
                    <p className="text-slate-400 font-medium">No projects yet.</p>
                    <p className="text-slate-600 text-sm mt-1">Approve a service request to auto-create one.</p>
                </div>
            )}

            <div className="space-y-4">
                {projects.map(p => {
                    const assignedIds = (p.assignedEmployees || []).map(e => e._id || e);
                    const isExpanded = expandedId === p._id;
                    const isAssigning = assigningId === p._id;

                    return (
                        <div
                            key={p._id}
                            className="card p-0 overflow-hidden border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                            <div
                                className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                                onClick={() => { setExpandedId(isExpanded ? null : p._id); setAssigningId(null); }}
                            >
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.status === 'completed' ? 'bg-blue-400' : p.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-semibold text-white truncate">{p.name}</span>
                                        <span className={statusCls(p.status)}>{p.status}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                                        {p.description || <span className="italic">No description</span>}
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center gap-6 shrink-0 text-xs text-slate-400">
                                    <div>
                                        <span className="text-slate-600 block mb-0.5 uppercase tracking-wider text-[10px]">Client</span>
                                        <span className="text-white font-medium">{p.client?.name || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-600 block mb-0.5 uppercase tracking-wider text-[10px]">Team</span>
                                        {(p.assignedEmployees || []).length > 0
                                            ? <span className="text-emerald-400 font-medium">{p.assignedEmployees.length} emp.</span>
                                            : <span className="text-amber-400 font-medium">Unassigned</span>}
                                    </div>
                                    <div>
                                        <span className="text-slate-600 block mb-0.5 uppercase tracking-wider text-[10px]">Created</span>
                                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <svg
                                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {isExpanded && (
                                <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-5">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-6">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Project Name</p>
                                            <p className="text-white font-semibold">{p.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Status</p>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="input-field text-xs py-1.5 px-2 w-auto"
                                                    defaultValue={p.status}
                                                    onChange={e => setStatusEdit({ ...statusEdit, [p._id]: e.target.value })}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="active">Active</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                {statusEdit[p._id] && statusEdit[p._id] !== p.status && (
                                                    <button className="btn-primary text-xs py-1.5 px-3" onClick={() => saveStatus(p)}>
                                                        {saving ? '…' : 'Save'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Created Date</p>
                                            <p className="text-slate-200">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Description</p>
                                            <p className="text-slate-300 text-sm">{p.description || <span className="text-slate-600 italic">No description provided.</span>}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Client</p>
                                            <div className="flex items-center gap-2">
                                                <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs font-bold">
                                                    {p.client?.name?.charAt(0) || '?'}
                                                </span>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{p.client?.name || '—'}</p>
                                                    {p.client?.company && <p className="text-slate-500 text-xs">{p.client.company}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-800/60 pt-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-slate-600">Assigned Employees</p>
                                                <p className="text-sm text-slate-300 mt-0.5">
                                                    {(p.assignedEmployees || []).length > 0
                                                        ? p.assignedEmployees.map(e => e.name).join(', ')
                                                        : <span className="text-amber-400">⚠️ No employees assigned yet</span>}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(ev) => { ev.stopPropagation(); setAssigningId(isAssigning ? null : p._id); }}
                                                className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
                                            >
                                                👥 {isAssigning ? 'Done' : 'Manage Team'}
                                            </button>
                                        </div>

                                        {isAssigning && (
                                            <div className="mt-3 rounded-2xl border border-slate-800 overflow-hidden">
                                                {employees.length === 0 && (
                                                    <p className="text-slate-600 text-xs px-4 py-3">No employees registered yet.</p>
                                                )}
                                                {employees.map((emp, i) => {
                                                    const isAssigned = assignedIds.includes(emp._id);
                                                    return (
                                                        <div
                                                            key={emp._id}
                                                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-slate-800/50 ${i !== 0 ? 'border-t border-slate-800/60' : ''}`}
                                                            onClick={() => toggleEmployee(p, emp._id)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isAssigned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                                                                    {emp.name?.charAt(0)}
                                                                </span>
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">{emp.name}</p>
                                                                    <p className="text-xs text-slate-500">{emp.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${isAssigned ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                                                <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isAssigned ? 'translate-x-5' : 'translate-x-0'}`} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800">
                                                    <p className="text-xs text-slate-500">Click a row to toggle assignment. Changes save immediately.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
