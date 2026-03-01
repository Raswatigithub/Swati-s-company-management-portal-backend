import React, { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const auth = () => ({});
const jsonAuth = () => ({ 'Content-Type': 'application/json' });

const roleColor = (role) =>
  role === 'admin' ? 'from-brand-600 to-brand-500' :
    role === 'employee' ? 'from-emerald-600 to-emerald-500' :
      'from-blue-600 to-blue-500';

const roleBadge = (role) =>
  role === 'admin' ? 'text-brand-400' :
    role === 'employee' ? 'text-emerald-400' :
      'text-blue-400';

export default function Messaging() {
  const [allMessages, setAllMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [thread, setThread] = useState([]);
  const [projects, setProjects] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const fetchData = useCallback(async () => {
    try {
      const [mRes, uRes, pRes] = await Promise.all([
        fetch(`${API}/messages`, { headers: auth() }),
        fetch(`${API}/users`, { headers: auth() }),
        fetch(`${API}/projects`, { headers: auth() }),
      ]);
      const mData = await mRes.json();
      const uData = await uRes.json();
      const pData = await pRes.json();
      setAllMessages(Array.isArray(mData) ? mData : []);
      setProjects(Array.isArray(pData) ? pData : []);

      const contactsMap = {};
      (Array.isArray(mData) ? mData : []).forEach(msg => {
        const fromId = msg.from?._id || msg.from;
        const toId = msg.to?._id || msg.to;
        const otherId = fromId === currentUser.id ? toId : fromId;
        const otherObj = fromId === currentUser.id ? msg.to : msg.from;
        if (otherId && otherId !== currentUser.id) {
          contactsMap[otherId] = typeof otherObj === 'object' && otherObj !== null
            ? otherObj
            : { _id: otherId, name: '(Unknown)', role: '?' };
        }
      });
      (Array.isArray(uData) ? uData : []).forEach(u => {
        if (u._id !== currentUser.id && !contactsMap[u._id]) contactsMap[u._id] = u;
      });
      setUsers(Array.isArray(uData) ? uData.filter(u => u._id !== currentUser.id) : []);
      setContacts(Object.values(contactsMap));
    } catch (err) { console.error(err); }
  }, [currentUser.id]);

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 5000); return () => clearInterval(i); }, [fetchData]);

  const loadThread = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API}/messages/conversation/${userId}`, { headers: auth() });
      const data = await res.json();
      setThread(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    if (activeUser) { loadThread(activeUser._id); const i = setInterval(() => loadThread(activeUser._id), 3000); return () => clearInterval(i); }
  }, [activeUser, loadThread]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!activeUser || !content.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/messages`, { method: 'POST', headers: jsonAuth(), body: JSON.stringify({ to: activeUser._id, content }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Send failed');
      setContent(''); loadThread(activeUser._id);
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const sharedProjects = projects.filter(p => {
    if (!activeUser) return false;
    const clientId = p.client?._id || p.client;
    const empIds = (p.assignedEmployees || []).map(e => e._id || e);
    return [clientId, ...empIds].includes(activeUser._id) || [clientId, ...empIds].includes(currentUser.id);
  });

  const unreadFrom = (uid) => allMessages.filter(m => (m.from?._id || m.from) === uid && !m.read).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Messages</h1>
      <p className="text-slate-400 text-sm mb-6">Chat with the team. Project context shown automatically.</p>

      <div className="flex gap-4" style={{ height: '70vh' }}>
        {/* Contacts */}
        <div className="w-56 shrink-0 flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
          <div className="px-4 py-3 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Contacts
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(u => {
              const unread = unreadFrom(u._id);
              const isActive = activeUser?._id === u._id;
              return (
                <button key={u._id} onClick={() => setActiveUser(u)} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all
                  ${isActive ? 'bg-brand-600/20 border-l-2 border-brand-400' : 'border-l-2 border-transparent hover:bg-white/5'}`}>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColor(u.role)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">{u.name}</div>
                    <div className={`text-[10px] capitalize ${roleBadge(u.role)}`}>{u.role}</div>
                  </div>
                  {unread > 0 && <span className="bg-brand-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{unread}</span>}
                </button>
              );
            })}
            {contacts.length === 0 && <p className="text-xs text-slate-600 px-4 py-4">No contacts yet</p>}
          </div>
          <div className="p-3 border-t border-slate-800">
            <select className="input-field text-xs py-1.5" value="" onChange={e => { const u = users.find(x => x._id === e.target.value); if (u) setActiveUser(u); }}>
              <option value="">+ New chat</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
          {!activeUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-3">
              <div className="text-5xl">💬</div>
              <div className="text-sm">Select a contact to start messaging</div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-800">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColor(activeUser.role)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {activeUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{activeUser.name}</div>
                  <div className={`text-xs capitalize ${roleBadge(activeUser.role)}`}>{activeUser.role}</div>
                </div>
                {sharedProjects.length > 0 && (
                  <div className="ml-auto flex flex-wrap gap-1.5 max-w-xs justify-end">
                    {sharedProjects.map(p => (
                      <span key={p._id} className="flex items-center gap-1 text-[10px] bg-brand-600/15 border border-brand-500/25 text-brand-300 px-2 py-0.5 rounded-full">
                        📁 {p.name}
                        <span className={`ml-1 px-1 rounded-full text-[9px] font-semibold ${p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : p.status === 'active' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>{p.status}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {thread.length === 0 && <div className="text-center text-slate-600 text-sm mt-8">No messages yet. Say hello! 👋</div>}
                {thread.map(msg => {
                  const fromId = msg.from?._id || msg.from;
                  const isMe = fromId === currentUser.id;
                  return (
                    <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="max-w-[72%]">
                        <div className={`text-[10px] text-slate-500 mb-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {isMe ? 'You' : (msg.from?.name || 'Unknown')} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className={`px-4 py-2.5 text-sm leading-relaxed break-words
                          ${isMe
                            ? 'bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-2xl rounded-br-sm'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-bl-sm'}`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Compose */}
              <form onSubmit={handleSend} className="flex gap-3 px-4 py-3 border-t border-slate-800">
                <input
                  className="input-field flex-1 py-2"
                  placeholder={`Message ${activeUser.name}…`}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
                <button type="submit" className="btn-primary px-5 py-2" disabled={loading || !content.trim()}>
                  {loading ? '…' : 'Send'}
                </button>
              </form>
              {error && <div className="text-red-400 text-xs px-5 pb-2">{error}</div>}
            </>
          )}
        </div>

        {/* Project panel */}
        {(currentUser.role === 'admin' || sharedProjects.length > 0) && (
          <div className="w-52 shrink-0 flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
            <div className="px-4 py-3 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {activeUser ? 'Shared Projects' : 'All Projects'}
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
              {(activeUser ? sharedProjects : projects).map(p => (
                <div key={p._id} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-800/50">
                  {p.image && <img src={p.image} alt={p.name} className="w-full h-16 object-cover" />}
                  <div className="p-2.5">
                    <div className="text-xs font-semibold text-white mb-1 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 mb-1">👤 {p.client?.name || '—'}</div>
                    <div className="text-[10px] text-slate-400 mb-1.5">👥 {(p.assignedEmployees || []).map(e => e.name).join(', ') || 'Unassigned'}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                      ${p.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : p.status === 'active' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-500/15 text-slate-400'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
              {(activeUser ? sharedProjects : projects).length === 0 && <p className="text-xs text-slate-600">No projects</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
