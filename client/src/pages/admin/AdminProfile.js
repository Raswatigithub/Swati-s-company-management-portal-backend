import React, { useState } from 'react';
import { toast } from 'react-toastify';
import API, { jsonAuth } from '../../utils/api';

export default function AdminProfile() {
    const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API}/users/${user.id || user._id}`, { method: 'PUT', headers: jsonAuth(), body: JSON.stringify({ name, password: password || undefined }) });
        if (res.ok) {
            const d = await res.json();
            localStorage.setItem('user', JSON.stringify({ ...user, name: d.user.name }));
            toast.success('Profile updated!');
            setPassword('');
        } else {
            toast.error('Update failed');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
            <p className="text-slate-400 text-sm mb-8">Update your account details.</p>
            <div className="card max-w-md">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div><label className="text-xs text-slate-400 mb-1 block">Name</label><input className="input-field" value={name} onChange={e => setName(e.target.value)} /></div>
                    <div><label className="text-xs text-slate-400 mb-1 block">New Password (optional)</label><input className="input-field" type="password" placeholder="Leave blank to keep current" value={password} onChange={e => setPassword(e.target.value)} /></div>
                    <button className="btn-primary" type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
}
