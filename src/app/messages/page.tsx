'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getConversations, getMessages, sendMessage, getMessageableUsers } from '@/lib/message-actions';
import { MessageSquare, Send, Search, Lock, ShieldCheck, Plus, User, Stethoscope, ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messageableUsers, setMessageableUsers] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && user) {
      loadConversations();
      loadMessageableUsers();
    }
  }, [user, authLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadConversations() {
    if (!user) return;
    setLoading(true);
    const res = await getConversations(user.id);
    if (res.success) setConversations(res.conversations);
    setLoading(false);
  }

  async function loadMessageableUsers() {
    if (!user) return;
    const res = await getMessageableUsers(user.id, user.role);
    if (res.success) setMessageableUsers(res.users);
  }

  async function selectConversation(partner: any) {
    setSelectedPartner(partner);
    setShowNewChat(false);
    if (!user) return;
    const res = await getMessages(user.id, partner.id);
    if (res.success) setMessages(res.messages);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedPartner || !newMessage.trim()) return;
    setSending(true);
    const res = await sendMessage(user.id, selectedPartner.id, newMessage);
    if (res.success && res.message) {
      setMessages(prev => [...prev, res.message]);
      setNewMessage('');
      // Update conversations list
      await loadConversations();
    }
    setSending(false);
  }

  function startNewChat(partner: any) {
    setSelectedPartner(partner);
    setMessages([]);
    setShowNewChat(false);
  }

  const filteredConversations = conversations.filter(c =>
    c.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass p-8 rounded-3xl border border-slate-800 text-center max-w-md space-y-4">
            <Lock className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Sign In Required</h2>
            <p className="text-slate-400 text-xs">Please log in to access the Secure Messaging Hub.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />

      <main className="flex-1 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <MessageSquare className="w-7 h-7 text-brand-400" />
                Secure Messaging
              </h1>
              <p className="text-slate-400 text-sm mt-1">End-to-end encrypted clinical communications</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-semibold">HIPAA Encrypted</span>
            </div>
          </div>

          {/* Main Chat Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 glass rounded-3xl border border-slate-800 overflow-hidden" style={{ minHeight: '600px' }}>

            {/* Sidebar: Conversations */}
            <div className={`lg:col-span-1 border-r border-slate-800 flex flex-col ${selectedPartner ? 'hidden lg:flex' : 'flex'}`}>
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Conversations</span>
                  <button
                    onClick={() => setShowNewChat(!showNewChat)}
                    className="p-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 rounded-lg border border-brand-500/20 transition"
                    title="New conversation"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                  />
                </div>
              </div>

              {/* New Chat Panel */}
              {showNewChat && (
                <div className="p-3 bg-brand-950/10 border-b border-slate-800 space-y-2">
                  <p className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">Start New Conversation</p>
                  {messageableUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => startNewChat(u)}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-slate-800 rounded-xl transition text-left"
                    >
                      <img src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} className="w-8 h-8 rounded-full object-cover border border-slate-700" alt={u.name} />
                      <div>
                        <p className="text-xs font-bold text-white">{u.name}</p>
                        <span className="text-[10px] text-slate-500 uppercase">{u.role}</span>
                      </div>
                    </button>
                  ))}
                  {messageableUsers.length === 0 && (
                    <p className="text-xs text-slate-500 italic px-2">No contacts available. Book a consultation first.</p>
                  )}
                </div>
              )}

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 && !showNewChat ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-400">No conversations yet</p>
                    <p className="text-xs text-slate-500 mt-1">Click + to start a new conversation</p>
                  </div>
                ) : (
                  filteredConversations.map(conv => {
                    const isActive = selectedPartner?.id === conv.partner.id;
                    return (
                      <button
                        key={conv.partner.id}
                        onClick={() => selectConversation(conv.partner)}
                        className={`w-full flex items-center gap-3 p-4 text-left transition border-b border-slate-800/40 ${
                          isActive ? 'bg-brand-950/20 border-l-2 border-l-brand-500' : 'hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <img src={conv.partner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} className="w-10 h-10 rounded-full object-cover border border-slate-700" alt={conv.partner.name} />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-bold text-white truncate">{conv.partner.name}</p>
                            {conv.unread > 0 && (
                              <span className="w-4 h-4 bg-brand-500 text-white text-[9px] font-black rounded-full flex items-center justify-center flex-shrink-0">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                          <span className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">{conv.partner.role}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className={`lg:col-span-2 flex flex-col ${!selectedPartner ? 'hidden lg:flex' : 'flex'}`}>
              {selectedPartner ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPartner(null)}
                      className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl mr-1 flex items-center justify-center transition"
                      title="Back to conversations"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <img src={selectedPartner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} className="w-10 h-10 rounded-full object-cover border border-slate-700" alt={selectedPartner.name} />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{selectedPartner.name}</p>
                      <div className="flex items-center gap-1.5">
                        {selectedPartner.role === 'DOCTOR' ? <Stethoscope className="w-3 h-3 text-brand-400" /> : <User className="w-3 h-3 text-cyan-400" />}
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{selectedPartner.role} • Online</span>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-semibold">Encrypted</span>
                    </div>
                  </div>

                  {/* Messages Thread */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                          <MessageSquare className="w-8 h-8 text-brand-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">No messages yet</p>
                          <p className="text-xs text-slate-500 mt-1">Send a secure, encrypted message below</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isMine = msg.sender.id === user.id;
                        return (
                          <div key={msg.id || idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-3`}>
                            {!isMine && (
                              <img src={msg.sender.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-1" alt={msg.sender.name} />
                            )}
                            <div className={`max-w-[70%] space-y-1 ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                isMine
                                  ? 'bg-brand-600 text-white rounded-br-sm'
                                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                              }`}>
                                {msg.content}
                              </div>
                              <span className="text-[10px] text-slate-600 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {isMine && (
                              <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'} className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-1" alt={user.name} />
                            )}
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950/40">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a secure message..."
                        className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-4 py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl transition flex items-center gap-2 font-semibold text-sm"
                      >
                        <Send className="w-4 h-4" />
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-2 text-center flex items-center justify-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Messages are end-to-end encrypted and HIPAA compliant
                    </p>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-6">
                  <div className="w-20 h-20 rounded-full bg-brand-500/10 border-2 border-brand-500/20 flex items-center justify-center">
                    <MessageSquare className="w-10 h-10 text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Secure Clinical Messaging</h2>
                    <p className="text-slate-400 text-sm mt-2 max-w-sm">Select a conversation from the left, or start a new encrypted chat with your healthcare team.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                    {[
                      { icon: <Lock className="w-5 h-5 text-emerald-400" />, label: 'End-to-End Encrypted' },
                      { icon: <ShieldCheck className="w-5 h-5 text-brand-400" />, label: 'HIPAA Compliant' },
                      { icon: <MessageSquare className="w-5 h-5 text-teal-400" />, label: 'Real-time Delivery' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex justify-center">{item.icon}</div>
                        <p className="text-[11px] text-slate-400 font-semibold">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
