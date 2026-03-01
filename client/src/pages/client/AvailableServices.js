import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

export default function AvailableServices() {
    const [services, setServices] = useState([]);
    useEffect(() => {
        fetch(`${API}/client/services`).then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : []));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Our Services</h1>
            <p className="text-slate-400 text-sm mb-8">Explore what we offer. Submit a request to get started.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {services.map(s => (
                    <div key={s._id} className="card p-0 overflow-hidden flex flex-col group hover:border-brand-500/40 transition-colors">
                        {s.image
                            ? <img src={s.image} alt={s.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                            : <div className="w-full h-24 bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-3xl">⚡</div>
                        }
                        <div className="p-4 flex flex-col gap-2 flex-1">
                            <h3 className="font-semibold text-white">{s.name}</h3>
                            <p className="text-slate-400 text-sm flex-1">{s.description}</p>
                            <Link to="/client/request" className="btn-primary text-xs py-2 text-center mt-2">Request This →</Link>
                        </div>
                    </div>
                ))}
                {services.length === 0 && <p className="text-slate-600 col-span-3">No services available yet.</p>}
            </div>
        </div>
    );
}
