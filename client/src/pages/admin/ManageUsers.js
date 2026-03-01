import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import API, { auth, jsonAuth } from '../../utils/api';

export default function ManageUsers({ role }) {
    const [users, setUsers] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
    const [loading, setLoading] = useState(false);

    const fetchUsers = useCallback(() => {
        fetch(`${API}/admin/users`, { headers: auth() })
            .then(r => r.json()).then(d => setUsers((d || []).filter(u => u.role === role)));
    }, [role]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleAdd = async (e) => {
        e.preventDefault(); setLoading(true);
        const res = await fetch(`${API}/admin/users`, { method: 'POST', headers: jsonAuth(), body: JSON.stringify({ ...form, role }) });
        if (res.ok) {
            toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} added successfully!`);
            setLoading(false); setShowAdd(false); fetchUsers();
            setForm({ name: '', email: '', password: '', company: '' });
        } else {
            const d = await res.json().catch(() => ({}));
            toast.error(d.message || 'Failed to add user');
            setLoading(false);
        }
    };

    const remove = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        const res = await fetch(`${API}/admin/users/${id}`, { method: 'DELETE', headers: auth() });
        if (res.ok) {
            toast.success('User removed');
            fetchUsers();
        } else {
            toast.error('Failed to remove user');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">{role === 'employee' ? 'Employees' : 'Clients'}</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage {role} accounts</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
                    {showAdd ? 'Cancel' : `+ Add ${role}`}
                </button>
            </div>

            {showAdd && (
                <div className="card mb-6">
                    <h3 className="text-base font-semibold text-white mb-4">New {role}</h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs text-slate-400 mb-1 block">Name</label><input className="input-field" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div><label className="text-xs text-slate-400 mb-1 block">Email</label><input className="input-field" type="email" placeholder="email@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                        <div><label className="text-xs text-slate-400 mb-1 block">Password</label><input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
                        {role === 'client' && <div><label className="text-xs text-slate-400 mb-1 block">Company</label><input className="input-field" placeholder="Company name" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} required /></div>}
                        <div className="col-span-2">
                            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Saving…' : `Create ${role}`}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card p-0 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-800">
                            <th className="text-left px-5 py-3 text-slate-400 font-medium">Name</th>
                            <th className="text-left px-5 py-3 text-slate-400 font-medium">Email</th>
                            {role === 'client' && <th className="text-left px-5 py-3 text-slate-400 font-medium">Company</th>}
                            <th className="text-right px-5 py-3 text-slate-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="border-b border-slate-800/60 hover:bg-white/3 transition-colors">
                                <td className="px-5 py-3 text-white font-medium">{u.name}</td>
                                <td className="px-5 py-3 text-slate-400">{u.email}</td>
                                {role === 'client' && <td className="px-5 py-3 text-slate-400">{u.company}</td>}
                                <td className="px-5 py-3 text-right">
                                    <button onClick={() => remove(u._id)} className="btn-danger text-xs">Remove</button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && <tr><td colSpan={role === 'client' ? 4 : 3} className="text-center py-12 text-slate-600">No {role}s found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
