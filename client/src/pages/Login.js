import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';

export default function Login() {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') setEmail('admin@swatisoft.com');
    else if (newRole === 'employee') setEmail('employee@swatisoft.com');
    else if (newRole === 'client') setEmail('client@swatisoft.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important to save the cookie
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('user', JSON.stringify(data.user)); // Still save basic user details
      toast.success(`Welcome back, ${data.user.name}!`);

      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'employee') navigate('/employee');
      else if (data.user.role === 'client') navigate('/client');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleStyles = {
    admin: {
      gradient: 'from-brand-600 to-brand-400',
      glow: 'shadow-brand-900/40',
      border: 'border-brand-500/30',
      text: 'text-brand-300',
      ring: 'ring-brand-400/40'
    },
    employee: {
      gradient: 'from-emerald-600 to-emerald-400',
      glow: 'shadow-emerald-900/40',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300',
      ring: 'ring-emerald-400/40'
    },
    client: {
      gradient: 'from-blue-600 to-blue-400',
      glow: 'shadow-blue-900/40',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      ring: 'ring-blue-400/40'
    }
  };

  const currentStyle = roleStyles[role];
  const roleCopy = {
    admin: 'Manage employees, clients, projects, and company-wide settings.',
    employee: 'Track assigned work, update task progress, and collaborate with the team.',
    client: 'Monitor deliverables, send feedback, and review project updates.'
  };
  const portalHighlights = [
    { title: 'Admin Console', description: 'Control users, approvals, and business operations from one dashboard.' },
    { title: 'Employee Workspace', description: 'Plan daily work, upload progress, and communicate with stakeholders.' },
    { title: 'Client Desk', description: 'View milestones, request changes, and stay aligned with the delivery team.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <section className="order-2 lg:order-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs uppercase tracking-wider text-slate-300">
            Swatis Comany Portal
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Role-Based Software Company Management Portal
          </h1>
          <p className="mt-5 max-w-xl text-slate-300">
            A centralized platform for Admins, Employees, and Clients to manage projects, communication, approvals, and delivery tracking.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {portalHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">Current login role</p>
            <p className={`mt-2 text-sm font-semibold capitalize ${currentStyle.text}`}>{role}</p>
            <p className="mt-2 text-sm text-slate-300">{roleCopy[role]}</p>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className={`mx-auto w-full max-w-md rounded-3xl border ${currentStyle.border} bg-slate-900/80 p-7 shadow-2xl backdrop-blur`}>
            <div className="mb-7 text-center">
              <div className={`mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-r ${currentStyle.gradient}`} />
              <h2 className="text-2xl font-bold text-white">Sign in</h2>
              <p className="mt-1 text-sm text-slate-400">Access your role-specific dashboard</p>
            </div>

            <div className="mb-7 grid grid-cols-3 gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-1.5">
              {Object.keys(roleStyles).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${role === r
                    ? `bg-gradient-to-r ${currentStyle.gradient} text-white`
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Work Email</label>
                <input
                  type="email"
                  className={`w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${currentStyle.ring}`}
                  placeholder="name@swatisoft.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${currentStyle.ring}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.96 9.96 0 016.213 2.174M15 12a3 3 0 11-4.5-2.6M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl bg-gradient-to-r ${currentStyle.gradient} px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60 ${currentStyle.glow}`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400">
              Demo emails: <span className="text-slate-200">admin@swatisoft.com</span>, <span className="text-slate-200">employee@swatisoft.com</span>, <span className="text-slate-200">client@swatisoft.com</span>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">© 2026 Swatis Comany Portal. All rights reserved.</p>
        </section>
      </div>
    </div>
  );
}
