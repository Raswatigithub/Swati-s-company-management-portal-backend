import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API, { jsonAuth } from '../../utils/api';

export default function RequestService() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API}/client/services`).then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : []));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        const res = await fetch(`${API}/client/requests`, { method: 'POST', headers: jsonAuth(), body: JSON.stringify({ service: selectedService, description }) });
        if (res.ok) {
            toast.success('Service request sent! We will review it shortly.');
            setSelectedService('');
            setDescription('');
        } else {
            toast.error('Failed to send request');
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">New Service Request</h1>
            <p className="text-slate-400 text-sm mb-8">Tell us what you need and we'll get started.</p>
            <div className="card max-w-xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Choose Service</label>
                        <select className="input-field" value={selectedService} onChange={e => setSelectedService(e.target.value)} required>
                            <option value="">— Select a service —</option>
                            {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                        {selectedService && (() => { const s = services.find(x => x._id === selectedService); return s?.image ? <img src={s.image} alt={s.name} className="mt-3 w-full h-36 object-cover rounded-xl" /> : null; })()}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Project Brief</label>
                        <textarea
                            className="input-field min-h-[120px] resize-none"
                            placeholder="Describe your requirements, goals, and timeline…"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? 'Submitting…' : 'Submit Request →'}</button>
                </form>
            </div>
        </div>
    );
}
