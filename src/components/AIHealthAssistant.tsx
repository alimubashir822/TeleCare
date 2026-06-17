'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Send, Bot, User, Globe, AlertCircle } from 'lucide-react';

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export default function AIHealthAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello ${user?.name || 'Sarah'} 👋. I am your TeleCare AI Health Assistant. How can I help you today? If you are prepping for an upcoming appointment, let me know your symptoms so I can write a summary report for your doctor.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response stream
    setTimeout(() => {
      let aiText = '';
      const textLower = userText.toLowerCase();

      // Simple heuristic flow for interactive intake & term translation
      if (textLower.includes('symptom') || textLower.includes('rash') || textLower.includes('pain') || textLower.includes('cough') || textLower.includes('sick')) {
        aiText = `I've noted that concern. To help me summarize this for your doctor:
1. When did this begin?
2. Have you tried any medications or creams?
3. Do you have any related allergies?`;
      } else if (textLower.includes('ago') || textLower.includes('weeks') || textLower.includes('days') || textLower.includes('none') || textLower.includes('no')) {
        aiText = `Thank you! I have compiled this intake summary:

**Patient Pre-Visit Summary**
- **Main Issue:** Skin irritation/symptoms reported
- **Duration:** 3 weeks (as reported)
- **Previous treatment:** None
- **Allergies:** No known allergies

I will share this summary directly on your Doctor's dashboard for your appointment! What else can I explain for you?`;
      } else if (textLower.includes('explain') || textLower.includes('hypertension') || textLower.includes('metoprolol') || textLower.includes('what is')) {
        aiText = `I can explain that! **Hypertension** is the clinical term for high blood pressure. **Metoprolol** is a beta-blocker medication prescribed to slow down heart rate and lower blood pressure, reducing stress on your heart. 

*Reminder: I am an AI assistant and do not provide medical diagnosis. Please consult your physician for advice.*`;
      } else if (textLower.includes('urdu') || textLower.includes('translate') || textLower.includes('urdu assistant')) {
        aiText = `جی بالکل! میں اردو میں بھی آپ کی مدد کر سکتا ہوں۔ آپ کو کیا علامات محسوس ہو رہی ہیں؟ (I can assist you in Urdu. What symptoms are you experiencing?)`;
      } else if (textLower.includes('arabic')) {
        aiText = `أهلاً بك! أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك اليوم؟ (Welcome! I am your AI Health Assistant. How can I help you today?)`;
      } else if (textLower.includes('spanish')) {
        aiText = `¡Hola! Soy tu asistente de salud de IA. ¿Cómo puedo ayudarte hoy con tus síntomas? (Hello! I am your AI Health Assistant. How can I help you today?)`;
      } else {
        aiText = `Understood. I can translate prescriptions, clarify medical terminology, and summarize your concerns for your doctor. 

If you are experiencing a medical emergency, please call 911 (or your local emergency services) immediately.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 1500);
  };

  const getLangPlaceholder = () => {
    switch (language) {
      case 'ur': return 'اردو میں لکھیں۔۔۔';
      case 'ar': return 'اكتب رسالتك هنا...';
      case 'es': return 'Escribe tu consulta aquí...';
      default: return 'Ask a health question or describe symptoms...';
    }
  };

  return (
    <div className="glass rounded-3xl border border-slate-800 flex flex-col h-[500px] overflow-hidden font-sans relative">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-brand-950/40 to-slate-900 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-500/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">AI Health Assistant</h3>
            <span className="text-[9px] text-slate-500">Intake Summaries & Term Explanations</span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              let greeting = '';
              if (e.target.value === 'ur') {
                greeting = 'السلام علیکم! میں آپ کا اے آئی ہیلتھ اسسٹنٹ ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟';
              } else if (e.target.value === 'ar') {
                greeting = 'مرحباً! أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك اليوم؟';
              } else if (e.target.value === 'es') {
                greeting = '¡Hola! Soy tu asistente de salud de IA. ¿Cómo puedo ayudarte hoy?';
              } else {
                greeting = 'Hello! I am your TeleCare AI Health Assistant. How can I help you today?';
              }
              setMessages(prev => [...prev, { sender: 'ai', text: greeting }]);
            }}
            className="bg-transparent text-[10px] text-slate-400 outline-none cursor-pointer border-none font-bold"
          >
            <option value="en" className="bg-slate-950 text-slate-300">English</option>
            <option value="ur" className="bg-slate-950 text-slate-300">Urdu</option>
            <option value="ar" className="bg-slate-950 text-slate-300">Arabic</option>
            <option value="es" className="bg-slate-950 text-slate-300">Spanish</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`p-2 h-fit rounded-xl border flex-shrink-0 ${
              m.sender === 'user' 
                ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' 
                : 'bg-slate-900 border-slate-850 text-slate-300'
            }`}>
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
              m.sender === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-none' 
                : 'bg-slate-900/60 border border-slate-850 text-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="p-2 h-fit rounded-xl border bg-slate-900 border-slate-850 text-slate-300 flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/60 border border-slate-855 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-900 text-[10px] text-slate-500 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
        <span className="truncate">This assistant does not diagnose diseases. In emergencies, seek real medical care.</span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900/50 border-t border-slate-850 flex gap-2">
        <input
          type="text"
          placeholder={getLangPlaceholder()}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 placeholder-slate-500"
          dir={language === 'ur' || language === 'ar' ? 'rtl' : 'ltr'}
        />
        <button
          type="submit"
          className="p-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl shadow transition duration-200"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
