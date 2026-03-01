import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API, { auth, jsonAuth } from '../../utils/api';
import ImageUpload from '../../components/ImageUpload';

export default function ManageServices() {
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const fetchServices = () =>
        fetch(`${API}/services`).then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : []));

    useEffect(() => { fetchServices(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API}/admin/services`, {
                method: 'POST',
                headers: jsonAuth(),
                body: JSON.stringify({ name, description, image })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to add service');
            }

            setName('');
            setDescription('');
            setImage('');
            setShowForm(false);
            fetchServices();
            toast.success('Service added successfully');
        } catch (error) {
            toast.error('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const del = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        const res = await fetch(`${API}/admin/services/${id}`, { method: 'DELETE', headers: auth() });
        if (res.ok) {
            toast.info('Service deleted');
            fetchServices();
        } else {
            toast.error('Failed to delete service');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Services</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {services.length} service{services.length !== 1 ? 's' : ''} available for clients to request.
                    </p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Cancel' : '+ New Service'}
                </button>
            </div>

            {showForm && (
                <div className="card mb-6 border border-brand-500/20 bg-slate-900/80">
                    <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-brand-600/30 flex items-center justify-center text-brand-400 text-xs">+</span>
                        Add New Service
                    </h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Service Name</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. Web Development"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Description</label>
                                <input
                                    className="input-field"
                                    placeholder="Brief description of the service"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <ImageUpload label="Service Cover Image" value={image} onChange={setImage} />
                        <div className="flex items-center gap-3">
                            <button className="btn-primary" type="submit" disabled={loading}>
                                {loading ? 'Adding…' : '+ Add Service'}
                            </button>
                            <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card p-0 overflow-hidden">
                <div className="grid grid-cols-[56px_1fr_2fr_auto] items-center gap-4 px-5 py-3 border-b border-slate-800 bg-slate-950/60">
                    <div className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Image</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Name</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold">Description</div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold text-right">Actions</div>
                </div>

                {services.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="text-4xl mb-3">⚡</div>
                        <p className="text-slate-400 font-medium">No services yet</p>
                        <p className="text-slate-600 text-sm mt-1">Click <strong className="text-slate-400">+ New Service</strong> to add your first one.</p>
                    </div>
                )}

                {services.map((s, i) => (
                    <div
                        key={s._id}
                        className={`grid grid-cols-[56px_1fr_2fr_auto] items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors ${i !== 0 ? 'border-t border-slate-800/60' : ''}`}
                    >
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-brand-700/40 to-brand-900/40 flex items-center justify-center">
                            {s.image
                                ? <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                                : <span className="text-lg">⚡</span>
                            }
                        </div>

                        <div>
                            <p className="font-semibold text-white text-sm">{s.name}</p>
                            {s.createdAt && (
                                <p className="text-[10px] text-slate-600 mt-0.5">
                                    Added {new Date(s.createdAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>

                        <p className="text-slate-400 text-sm line-clamp-2">{s.description || <span className="italic text-slate-600">No description</span>}</p>

                        <div className="flex items-center justify-end">
                            <button
                                onClick={() => del(s._id)}
                                className="btn-danger text-xs flex items-center gap-1.5 py-1.5 px-3"
                            >
                                🗑 Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
