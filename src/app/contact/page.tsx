'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Get in Touch</span>
            <h1 className="text-4xl font-black text-white tracking-tight mt-2">We are Here to Help</h1>
            <p className="text-slate-400 mt-3 text-sm">
              Have questions about billing, security compliances, or onboarding your clinic? Drop us a message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Info Cards */}
            <div className="space-y-6">
              <div className="glass p-6 rounded-3xl border border-slate-800 flex gap-4">
                <div className="p-3 bg-brand-500/10 rounded-2xl h-fit text-brand-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white">Email Support</h3>
                  <p className="text-xs text-slate-400 mt-1">Our support agents reply within 2 hours during business schedules.</p>
                  <p className="text-xs text-teal-400 font-semibold mt-2">support@telecare.ai</p>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-slate-800 flex gap-4">
                <div className="p-3 bg-brand-500/10 rounded-2xl h-fit text-brand-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white">Call Center</h3>
                  <p className="text-xs text-slate-400 mt-1">Available Mon-Fri 9am-6pm EST for emergency platform issues.</p>
                  <p className="text-xs text-teal-400 font-semibold mt-2">+1 (800) 555-CARE</p>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl border border-slate-800 flex gap-4">
                <div className="p-3 bg-brand-500/10 rounded-2xl h-fit text-brand-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-white">Headquarters</h3>
                  <p className="text-xs text-slate-400 mt-1">TeleCare AI, Inc. Office park.</p>
                  <p className="text-xs text-teal-400 font-semibold mt-2">100 Health Tech Way, San Francisco, CA</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass p-8 rounded-3xl border border-slate-800">
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Message Received!</h3>
                  <p className="text-xs text-slate-400">Thank you. One of our health tech integration specialists will get back to you shortly.</p>
                  <button 
                    onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }}
                    className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 transition"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 transition"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Your Message</label>
                    <textarea
                      placeholder="How can we support you?"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 transition resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
