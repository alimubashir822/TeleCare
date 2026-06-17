'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getDoctors } from '@/lib/doctor-actions';
import { createAppointment } from '@/lib/appointment-actions';
import { 
  Search, SlidersHorizontal, Stethoscope, Star, 
  Globe, Clock, Award, DollarSign, Calendar, 
  CreditCard, ShieldCheck, CheckCircle2, ChevronRight, X, Sparkles, BrainCircuit, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

function DoctorSearchInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Active view: 'catalog' | 'aimatch'
  const [activeTab, setActiveTab] = useState('catalog');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || 'All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [minExperience, setMinExperience] = useState('All');
  const [maxPrice, setMaxPrice] = useState('All');

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Matching States
  const [aiSymptoms, setAiSymptoms] = useState('');
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  // Booking Wizard States
  const [bookingDoctor, setBookingDoctor] = useState<any | null>(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Type & Date, 2: Slot & Pay, 3: Success
  const [appType, setAppType] = useState('VIDEO');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const specialties = ['All', 'Dermatology', 'Cardiology', 'Pediatrics', 'Psychiatry', 'General Medicine'];
  const languages = ['All', 'English', 'Urdu', 'Arabic', 'Spanish'];
  const experienceOptions = ['All', '5+ Years', '10+ Years', '12+ Years'];
  const priceOptions = ['All', 'Under $120', 'Under $150', 'Under $185'];

  const timeSlots = ['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM'];

  // Load doctors from db on filter change
  useEffect(() => {
    async function fetchFilteredDoctors() {
      setLoading(true);
      const filters: any = {};
      if (selectedSpecialty !== 'All') filters.specialty = selectedSpecialty;
      if (selectedLanguage !== 'All') filters.language = selectedLanguage;
      if (searchQuery) filters.searchQuery = searchQuery;

      if (minExperience !== 'All') {
        const years = parseInt(minExperience);
        filters.minExperience = years;
      }
      if (maxPrice !== 'All') {
        const price = parseInt(maxPrice.replace(/[^0-9]/g, ''));
        filters.maxPrice = price;
      }

      const res = await getDoctors(filters);
      if (res.success && res.doctors) {
        setDoctors(res.doctors);
      }
      setLoading(false);
    }
    fetchFilteredDoctors();
  }, [searchQuery, selectedSpecialty, selectedLanguage, minExperience, maxPrice]);

  const handleOpenBooking = (doctor: any) => {
    if (!user) {
      alert('Please log in using the switch widget at the bottom right before booking an appointment.');
      return;
    }
    if (user.role !== 'PATIENT') {
      alert('Only registered Patients can book appointments. Please switch to "Sarah Jenkins" using the switch panel.');
      return;
    }
    setBookingDoctor(doctor);
    setBookingStep(1);
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setSelectedSlot('');
  };

  const handleNextStep = () => {
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }
    setBookingStep(2);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please choose a time slot.');
      return;
    }
    if (cardNumber.length < 16 || !cardExpiry || cardCvc.length < 3) {
      alert('Please fill out the mock card payment details.');
      return;
    }

    setIsSubmitting(true);
    const dateTimeStr = `${selectedDate}T${convertSlotTo24h(selectedSlot)}`;
    
    const res = await createAppointment({
      patientUserId: user?.id || '',
      doctorId: bookingDoctor.id,
      type: appType,
      dateTime: dateTimeStr,
      amount: bookingDoctor.price
    });

    setIsSubmitting(false);

    if (res.success) {
      setBookingStep(3);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      alert(res.error || 'Failed to complete booking.');
    }
  };

  const convertSlotTo24h = (slot: string) => {
    const [time, modifier] = slot.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return `${hours}:${minutes}:00`;
  };

  // AI Matching Logic
  const handleAIMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiSymptoms.trim()) return;

    setIsMatching(true);
    
    setTimeout(async () => {
      // Fetch all doctors to filter locally
      const res = await getDoctors({});
      if (res.success && res.doctors) {
        const textLower = aiSymptoms.toLowerCase();
        
        const scored = res.doctors.map((doc: any) => {
          let score = 50; // base score
          const reasons = [];

          // Keyword matches
          const specialty = doc.specialty.toLowerCase();
          
          if (specialty === 'dermatology' && (textLower.includes('skin') || textLower.includes('rash') || textLower.includes('eczema') || textLower.includes('spots') || textLower.includes('itching'))) {
            score += 45;
            reasons.push('Matches clinical category for skin/dermatological concerns');
          } else if (specialty === 'cardiology' && (textLower.includes('heart') || textLower.includes('chest') || textLower.includes('pressure') || textLower.includes('bp') || textLower.includes('breathing'))) {
            score += 47;
            reasons.push('Matches cardiology category for cardiac & chest symptoms');
          } else if (specialty === 'pediatrics' && (textLower.includes('child') || textLower.includes('kids') || textLower.includes('baby') || textLower.includes('newborn'))) {
            score += 42;
            reasons.push('Matches childhood development & pediatrics care guidelines');
          } else if (specialty === 'psychiatry' && (textLower.includes('anxiety') || textLower.includes('depression') || textLower.includes('stress') || textLower.includes('adhd') || textLower.includes('mental'))) {
            score += 44;
            reasons.push('Matches therapy & mental health clinical category');
          } else if (specialty === 'general medicine') {
            score += 35; // broad fallback
            reasons.push('Primary care physician recommended for generic evaluation');
          }

          // Experience weighting
          if (doc.experience >= 12) {
            score += 4;
            reasons.push('Senior physician with over 12 years clinical practice');
          }

          // Rating weighting
          if (doc.rating >= 4.9) {
            score += 3;
            reasons.push('Outstanding doctor ratings based on patient satisfaction');
          }

          // Cap matching score at 99%
          const finalScore = Math.min(score, 99);

          return {
            ...doc,
            matchScore: finalScore,
            matchReasons: reasons.slice(0, 3)
          };
        });

        // Filter and sort by matchScore desc
        const sorted = scored
          .filter((d: any) => d.matchScore > 65)
          .sort((a: any, b: any) => b.matchScore - a.matchScore);

        setMatchingResults(sorted);
      }
      setIsMatching(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="mb-10 text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Discover Healthcare Specialists</h1>
              <p className="text-slate-400 mt-2 text-sm">Find specialists or let our clinical AI match you based on symptoms.</p>
            </div>

            {/* Sub Tabs Toggle */}
            <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'catalog'
                    ? 'bg-brand-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Browse Marketplace
              </button>
              <button
                onClick={() => setActiveTab('aimatch')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'aimatch'
                    ? 'bg-brand-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Let AI Match Me
              </button>
            </div>
          </div>

          {/* VIEW 1: CATALOG MARKETPLACE VIEW */}
          {activeTab === 'catalog' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Filters Sidebar */}
              <div className="glass p-6 rounded-3xl border border-slate-800 h-fit space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-850">
                  <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                    Filters
                  </span>
                  {(selectedSpecialty !== 'All' || selectedLanguage !== 'All' || minExperience !== 'All' || maxPrice !== 'All' || searchQuery !== '') && (
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSpecialty('All');
                        setSelectedLanguage('All');
                        setMinExperience('All');
                        setMaxPrice('All');
                      }}
                      className="text-xs text-brand-400 hover:text-white transition font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Search Name/Keyword</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Dr. Name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Specialty */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Specialty</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition"
                  >
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Experience</label>
                  <select
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition"
                  >
                    {experienceOptions.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                {/* Consultation Price */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Consultation Fee</label>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition"
                  >
                    {priceOptions.map(price => (
                      <option key={price} value={price}>{price}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="lg:col-span-3 space-y-6">
                {loading ? (
                  <div className="text-center py-20">
                    <div className="inline-block animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
                    <p className="text-slate-500 text-sm mt-4">Loading doctors catalog...</p>
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="glass p-16 rounded-3xl border border-slate-800 text-center">
                    <Stethoscope className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white">No doctors matching filters</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">Try widening your filters to find specialists.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {doctors.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="glass p-6 rounded-3xl border border-slate-800 hover:border-brand-500/20 transition flex flex-col justify-between"
                      >
                        <div>
                          {/* Profile Header */}
                          <div className="flex gap-4">
                            <img 
                              src={doc.user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120'} 
                              alt={doc.user.name} 
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-700"
                            />
                            <div className="text-left">
                              <h3 className="text-lg font-bold text-white hover:text-brand-300 transition leading-tight">{doc.user.name}</h3>
                              <span className="inline-block px-2.5 py-0.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg text-xs font-semibold mt-1">
                                {doc.specialty}
                              </span>
                            </div>
                          </div>

                          {/* Bio */}
                          <p className="text-xs text-slate-400 mt-4 leading-relaxed line-clamp-2">{doc.bio}</p>

                          {/* Details */}
                          <div className="mt-5 pt-4 border-t border-slate-850 grid grid-cols-2 gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-slate-500" />
                              <span>{doc.experience} Years Exp</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-slate-500 truncate" />
                              <span className="truncate">{doc.languages}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-500" />
                              <span>{doc.availability.split(':')[0]}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                              <Star className="w-4 h-4 fill-amber-400" />
                              <span>{doc.rating.toFixed(1)} Rating</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">Consultation Fee</p>
                            <p className="text-lg font-black text-white mt-1">${doc.price}</p>
                          </div>
                          <button
                            onClick={() => handleOpenBooking(doc)}
                            className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-brand-500/10"
                          >
                            Book Consultation
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: AI MATCH MAKER DIRECTORY */}
          {activeTab === 'aimatch' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              
              {/* Input Form Box */}
              <div className="glass p-8 rounded-3xl border border-slate-850 space-y-6 text-left">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-500/10 rounded-2xl text-brand-400">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">AI Matching Companion</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Describe symptoms to match you with recommended certified physicians.</p>
                  </div>
                </div>

                <form onSubmit={handleAIMatch} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">How do you feel today?</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. I have a severe skin rash on my wrist that has been dry and itchy for 3 weeks..."
                      value={aiSymptoms}
                      onChange={(e) => setAiSymptoms(e.target.value)}
                      className="w-full p-4 bg-slate-900 border border-slate-850 rounded-2xl text-xs text-white focus:outline-none focus:border-brand-500 placeholder-slate-500 resize-none leading-relaxed"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isMatching}
                    className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
                  >
                    {isMatching ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <span>Find Best Doctor Match</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Matching Results */}
              {isMatching ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
                  <p className="text-xs text-slate-500 mt-3">Analyzing symptoms & scoring clinic files...</p>
                </div>
              ) : matchingResults.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-left pb-2 border-b border-slate-900">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">AI Recommendation List ({matchingResults.length} matches)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchingResults.map((doc) => (
                      <div 
                        key={doc.id}
                        className="glass p-6 rounded-3xl border border-slate-800 hover:border-brand-500/20 transition flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          {/* Profile Header & Match score badge */}
                          <div className="flex justify-between items-start gap-4 text-left">
                            <div className="flex gap-3">
                              <img src={doc.user.avatar} className="w-11 h-11 rounded-xl object-cover border border-slate-700" />
                              <div>
                                <h4 className="text-sm font-bold text-white leading-tight">{doc.user.name}</h4>
                                <span className="inline-block px-2 py-0.5 bg-slate-900 border border-slate-850 text-brand-400 rounded text-[10px] font-semibold mt-1">
                                  {doc.specialty}
                                </span>
                              </div>
                            </div>

                            <span className="px-2.5 py-1 bg-teal-950/20 border border-teal-900/30 text-teal-400 rounded-xl text-[10px] font-black text-glow">
                              {doc.matchScore}% Match
                            </span>
                          </div>

                          {/* Matching factors reasons */}
                          <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-2xl text-xs text-left space-y-2">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Matching Factors:</span>
                            <ul className="space-y-1 text-slate-300 pl-1">
                              {doc.matchReasons?.map((r: string, idx: number) => (
                                <li key={idx} className="flex gap-2 items-center text-[11px]">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                  <span className="leading-normal">{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Booking CTA footer */}
                        <div className="mt-6 pt-4 border-t border-slate-850 flex justify-between items-center">
                          <span className="text-sm font-bold text-white">${doc.price}</span>
                          <button
                            onClick={() => handleOpenBooking(doc)}
                            className="px-4 py-2 bg-brand-50 hover:bg-brand-400 text-slate-950 text-xs font-bold rounded-xl transition"
                          >
                            Book Instantly
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : aiSymptoms.trim() ? (
                <div className="glass p-12 rounded-3xl border border-slate-800 text-center">
                  <Stethoscope className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-white">No perfect match scored</h4>
                  <p className="text-xs text-slate-500 mt-1">Try refining your symptom descriptions to fetch matches.</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>

      {/* Booking Wizard Drawer/Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="glass w-full max-w-lg rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setBookingDoctor(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step 1: Selection & Date */}
            {bookingStep === 1 && (
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Schedule Consultation</h2>
                  <p className="text-xs text-slate-400 mt-1">Book a secure consultation with {bookingDoctor.user.name}</p>
                </div>

                <div className="flex gap-4 p-3 bg-slate-900/50 border border-slate-850 rounded-2xl">
                  <img src={bookingDoctor.user.avatar} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{bookingDoctor.user.name}</h4>
                    <p className="text-xs text-brand-400 font-semibold">{bookingDoctor.specialty} • ${bookingDoctor.price}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Appointment Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'VIDEO', label: 'Video Call' },
                      { id: 'FOLLOWUP', label: 'Follow-up' },
                      { id: 'EMERGENCY', label: 'Emergency' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setAppType(t.id)}
                        className={`px-3 py-2.5 text-xs font-bold border rounded-xl transition ${
                          appType === t.id 
                            ? 'bg-brand-500/10 border-brand-500 text-brand-300' 
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Select Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-900 border border-slate-850 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
                >
                  <span>Select Time & Pay</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Slot & Payment */}
            {bookingStep === 2 && (
              <form onSubmit={handleConfirmBooking} className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Confirm Details & Pay</h2>
                  <p className="text-xs text-slate-400 mt-1">Provide mock card details to process payment of ${bookingDoctor.price}</p>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Select Time Slot ({selectedDate})</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 text-xs font-bold border rounded-xl transition ${
                          selectedSlot === slot 
                            ? 'bg-brand-500/10 border-brand-500 text-brand-300' 
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-900/50 border border-slate-850 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-brand-400" />
                    Mock Credit Card Form
                  </span>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Card Number (e.g. 4242 4242 4242 4242)"
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 transition"
                      required
                    />
                    <input
                      type="password"
                      placeholder="CVC"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 transition"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center px-2 text-sm">
                  <span className="text-slate-400">Total Consultation Charge:</span>
                  <span className="text-lg font-black text-white">${bookingDoctor.price}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Confirm & Pay ${bookingDoctor.price}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {bookingStep === 3 && (
              <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Booking Confirmed!</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Your appointment has been successfully scheduled and synced to your dashboard calendar.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl text-left text-xs space-y-2">
                  <p><span className="text-slate-500">Doctor:</span> <span className="text-white font-semibold">{bookingDoctor.user.name}</span></p>
                  <p><span className="text-slate-500">Specialty:</span> <span className="text-white font-semibold">{bookingDoctor.specialty}</span></p>
                  <p><span className="text-slate-500">Time:</span> <span className="text-white font-semibold">{selectedDate} at {selectedSlot}</span></p>
                  <p><span className="text-slate-500">Type:</span> <span className="text-white font-semibold uppercase">{appType} consultation</span></p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setBookingDoctor(null);
                      window.location.href = '/patient/dashboard';
                    }}
                    className="flex-1 py-3 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 font-bold rounded-2xl transition"
                  >
                    Go to Patient Dashboard
                  </button>
                  <button
                    onClick={() => setBookingDoctor(null)}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-800 hover:border-slate-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function FindDoctors() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col min-h-screen bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </div>
    }>
      <DoctorSearchInner />
    </React.Suspense>
  );
}
