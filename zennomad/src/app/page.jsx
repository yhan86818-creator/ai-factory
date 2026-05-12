'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  ChevronRight, 
  Plane, 
  Wallet, 
  Lock, 
  Info,
  CheckCircle2,
  AlertCircle,
  MapPin,
  TrendingDown,
  Calendar,
  Plus,
  BookOpen,
  BarChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { nomadVisas, calculateTaxSavings } from '../lib/nomadData';
import { blogPosts } from '../lib/blogData';

export default function LandingPage() {
  const [step, setStep] = useState('landing'); // landing, simulator, blog-post
  const [formData, setFormData] = useState({
    income: 100000,
    currentTax: 35,
    currentLivingCost: 4000,
    citizenship: 'USA',
  });
  const [selectedCountry, setSelectedCountry] = useState(nomadVisas[0].id);
  const [compareCountries, setCompareCountries] = useState([nomadVisas[0].id, nomadVisas[1].id, nomadVisas[2].id]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleVerify = async () => {
    if (!licenseKey.trim()) return;
    setIsVerifying(true);
    setVerifyError('');
    
    // Fallback for testing
    if (licenseKey.toUpperCase() === 'ZEN-PRO-2026') {
      setTimeout(() => {
        setIsPro(true);
        setIsProModalOpen(false);
        setStep('pro-dashboard');
        setIsVerifying(false);
      }, 800);
      return;
    }

    try {
      const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_permalink: 'rpfze',
          license_key: licenseKey
        })
      });
      
      const data = await res.json();
      
      if (data.success && !data.purchase.refunded) {
        setIsPro(true);
        setIsProModalOpen(false);
        setStep('pro-dashboard');
      } else {
        setVerifyError('Invalid or refunded license key.');
      }
    } catch (err) {
      setVerifyError('Verification failed. Check your internet connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      if (stepParam) {
        setStep(stepParam);
      }
    }
  }, []);

  // Tracker State
  const [trips, setTrips] = useState([
    { id: 1, country: 'Japan', startDate: '2026-01-10', endDate: '2026-03-20', days: 69 }
  ]);
  const [newTrip, setNewTrip] = useState({ country: nomadVisas[8].name, startDate: '', endDate: '' });

  const addTrip = () => {
    if (!newTrip.startDate || !newTrip.endDate) return;
    const start = new Date(newTrip.startDate);
    const end = new Date(newTrip.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    setTrips([...trips, { ...newTrip, id: Date.now(), days }]);
    setNewTrip({ ...newTrip, startDate: '', endDate: '' });
  };

  const daysByCountry = useMemo(() => {
    const counts = {};
    trips.forEach(t => {
      counts[t.country] = (counts[t.country] || 0) + t.days;
    });
    return counts;
  }, [trips]);

  const targetVisa = nomadVisas.find(v => v.id === selectedCountry);

  const savings = useMemo(() => {
    const taxSavings = calculateTaxSavings(formData.income, formData.currentTax, selectedCountry);
    const annualCurrentLiving = formData.currentLivingCost * 12;
    const annualTargetLiving = (targetVisa?.monthlyLivingCost || 0) * 12;
    const livingCostSavings = annualCurrentLiving - annualTargetLiving;
    
    return {
      tax: taxSavings,
      living: livingCostSavings,
      total: taxSavings + livingCostSavings
    };
  }, [formData, selectedCountry, targetVisa]);

  const isAppView = ['simulator', 'tracker', 'compare', 'pro-dashboard'].includes(step);

  return (
    <main className={`min-h-screen ${isAppView ? 'bg-background md:flex md:overflow-hidden' : 'bg-background overflow-x-hidden'} selection:bg-primary/30 text-foreground font-sans`}>
      
      {/* SaaS Sidebar (Only in App View) */}
      {isAppView && (
        <aside className="w-72 border-r border-border/20 bg-card/30 backdrop-blur-3xl flex-col z-50 hidden md:flex shadow-2xl">
           <div className="p-6 border-b border-border/20 flex items-center gap-3 cursor-pointer hover:bg-black/5 transition-colors" onClick={() => setStep('landing')}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                 <Globe size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">ZenNomad</span>
           </div>
           
           <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2 no-scrollbar">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 px-4">Tools & Analysis</p>
              <button 
                onClick={() => setStep('simulator')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-bold ${step === 'simulator' ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground border border-transparent'}`}
              >
                <Zap size={18} className={step === 'simulator' ? 'text-primary' : 'text-muted-foreground'} /> Tax Simulator
              </button>
              <button 
                onClick={() => setStep('tracker')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-bold ${step === 'tracker' ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground border border-transparent'}`}
              >
                <Calendar size={18} className={step === 'tracker' ? 'text-primary' : 'text-muted-foreground'} /> 183-Day Tracker
              </button>
              <button 
                onClick={() => setStep('compare')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-bold ${step === 'compare' ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground border border-transparent'}`}
              >
                <BarChart size={18} className={step === 'compare' ? 'text-primary' : 'text-muted-foreground'} /> Multi-Compare
              </button>
              
              <div className="mt-8 mb-6 border-t border-border/20 pt-8" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 px-4 flex items-center justify-between">
                 Pro Area
                 {isPro && <span className="text-[8px] bg-accent/20 text-accent px-2 py-0.5 rounded-full border border-accent/30">ACTIVE</span>}
              </p>
              <button 
                onClick={() => isPro ? setStep('pro-dashboard') : setIsProModalOpen(true)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-bold ${step === 'pro-dashboard' ? 'bg-accent/10 text-accent border border-accent/20 shadow-lg shadow-accent/5' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground border border-transparent'}`}
              >
                {isPro ? <CheckCircle2 size={18} className={step === 'pro-dashboard' ? 'text-accent' : ''} /> : <Lock size={18} className="text-muted-foreground" />}
                Execution Hub
              </button>
           </div>
           
           <div className="p-6 border-t border-border/20 bg-black/20">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
                    <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                       <span className="font-bold text-xs text-white">ZN</span>
                    </div>
                 </div>
                 <div>
                    <p className="text-sm font-bold text-foreground">{isPro ? 'Pro Member' : 'Free Plan'}</p>
                    <p className="text-[10px] text-muted-foreground">{isPro ? 'All tools unlocked' : 'Upgrade for blueprints'}</p>
                 </div>
              </div>
           </div>
        </aside>
      )}

      {/* Existing Landing Page Nav (Only if NOT App View) */}
      {!isAppView && (
        <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-background/70 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setStep('landing')}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Globe size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">ZenNomad</span>
          </div>
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <button onClick={() => setStep('guide')} className="hover:text-primary transition-colors uppercase tracking-[0.2em]">How it works</button>
            <button onClick={() => setStep('compare')} className="hover:text-primary transition-colors uppercase tracking-[0.2em]">Compare</button>
            <a href="#blog" className="hover:text-primary transition-colors">Insights</a>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep('tracker')} className="btn-secondary py-2 px-6 text-sm">183-Day Tracker</button>
            <button onClick={() => setStep('simulator')} className="btn-primary py-2 px-6 text-sm">Check Savings</button>
          </div>
        </nav>
      )}

      {/* Main Content Wrapper */}
      <div className={isAppView ? 'flex-1 flex flex-col h-screen overflow-hidden relative' : 'w-full'}>
         
         {/* Top App Bar (Only in App View) */}
         {isAppView && (
            <header className="h-20 border-b border-border/20 flex items-center justify-between px-8 bg-card/30 backdrop-blur-xl z-10 hidden md:flex shadow-sm">
               <h2 className="text-xl font-black tracking-tight uppercase italic text-foreground">
                  {step.replace('-', ' ')}
               </h2>
               <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-mono">Local-First Engine Active</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {!isPro && (
                     <button onClick={() => setIsProModalOpen(true)} className="ml-4 btn-primary py-2 px-6 text-xs flex items-center gap-2">
                        <Lock size={14} /> Upgrade to Pro
                     </button>
                  )}
               </div>
            </header>
         )}

         {/* Aurora Background for App View */}
         {isAppView && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
               
               
            </div>
         )}

         {/* Scrollable Content Area */}
         <div className={isAppView ? 'flex-1 overflow-y-auto p-4 md:p-8 z-10 no-scrollbar pt-24 md:pt-8' : ''}>
            <AnimatePresence mode="wait">
        {step === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-40 relative"
          >
            {/* Aurora background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
              
              
              
            </div>

            {/* Hero Section */}
            <section className="px-6 text-center max-w-5xl mx-auto relative z-10 dot-grid">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20 mb-8">
                  100% Local-First & Private
                </span>
                <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] uppercase tracking-tighter italic">
                  Optimize Your <span className="gradient-text">Tax & Freedom</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                  Calculate tax savings and find digital nomad visas across 50+ countries. Your data never leaves your browser. Pure logic, no trackers.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <button onClick={() => setStep('simulator')} className="btn-primary text-lg px-10 group">
                    Start Simulation <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <a href="#blog" className="btn-secondary text-lg px-10">
                    Expert Insights
                  </a>
                </div>
              </motion.div>

              {/* Visual Element */}
              <motion.div 
                className="mt-24 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-primary/10 blur-[100px] rounded-full z-0" />
                <div className="fintech-card rounded-[3rem] p-4 relative z-10  overflow-hidden">
                   <div className="bg-card rounded-[2.5rem] p-8 md:p-12 text-left">
                      <div className="flex justify-between items-start mb-12">
                         <div>
                            <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Simulated Outcome</p>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic gradient-text">Save $24,500/year</h3>
                         </div>
                         <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20 ">
                            <TrendingDown size={32} />
                         </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-8">
                         <div className="space-y-2">
                            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Target Country</p>
                            <p className="text-2xl font-bold flex items-center gap-2">Spain <span className="text-xs text-muted-foreground font-normal">(Beckham Law)</span></p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Visa Success Rate</p>
                            <p className="text-2xl font-bold text-primary">88% High</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Complexity</p>
                            <div className="flex gap-1">
                               {[1,2,3].map(i => <div key={i} className={`h-1.5 w-6 rounded-full ${i <= 2 ? 'bg-primary' : 'bg-muted/50'}`} />)}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            </section>

            {/* Why Local Section */}
            <section id="privacy" className="py-60 px-6">
               <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
                  <div>
                     <h2 className="text-5xl md:text-7xl font-black mb-12 uppercase tracking-tighter italic leading-none">
                        Your Life is <br /> <span className="text-primary">Private</span>
                     </h2>
                     <div className="space-y-8">
                        <div className="flex gap-6">
                           <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                              <Lock size={32} />
                           </div>
                           <div>
                              <h4 className="text-2xl font-bold mb-2 uppercase tracking-tight">Zero Server Sync</h4>
                              <p className="text-muted-foreground leading-relaxed">Your income, tax history, and travel plans are sensitive. ZenNomad runs 100% in your browser. We never see your data.</p>
                           </div>
                        </div>
                        <div className="flex gap-6">
                           <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent shrink-0 border border-accent/20">
                              <ShieldCheck size={32} />
                           </div>
                           <div>
                              <h4 className="text-2xl font-bold mb-2 uppercase tracking-tight">Legal Compliance</h4>
                              <p className="text-muted-foreground leading-relaxed">We encode global visa laws into local logic. No tracking cookies, no external APIs. Just clean, private calculations.</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-4 pt-12">
                        <div className="fintech-card p-8 rounded-3xl h-64 flex flex-col justify-end border-border/50">
                           <Zap className="text-primary mb-4" size={40} />
                           <h5 className="font-bold uppercase tracking-widest text-xs">Instant Results</h5>
                        </div>
                        <div className="fintech-card p-8 rounded-3xl h-80 flex flex-col justify-end border-border/50 bg-primary/5">
                           <Globe className="text-primary mb-4" size={40} />
                           <h5 className="font-bold uppercase tracking-widest text-xs">50+ Countries</h5>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="fintech-card p-8 rounded-3xl h-80 flex flex-col justify-end border-border/50 bg-accent/5">
                           <Wallet className="text-accent mb-4" size={40} />
                           <h5 className="font-bold uppercase tracking-widest text-xs">Tax Optimizer</h5>
                        </div>
                        <div className="fintech-card p-8 rounded-3xl h-64 flex flex-col justify-end border-border/50">
                           <Plane className="text-primary mb-4" size={40} />
                           <h5 className="font-bold uppercase tracking-widest text-xs">Visa Guides</h5>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Blog/SEO Section */}
            <section id="blog" className="py-40 px-6 bg-card">
               <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                     <div>
                        <span className="text-primary font-black uppercase tracking-widest text-[10px] mb-4 block">Knowledge Base</span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                           Nomad <br /> <span className="text-primary">Intelligence</span>
                        </h2>
                     </div>
                     <p className="text-muted-foreground max-w-md text-right">
                        Deep dives into international tax law, visa updates, and lifestyle optimization for the modern digital nomad.
                     </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                     {blogPosts.map((post, idx) => (
                        <motion.div 
                           key={post.id}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           className="block fintech-card p-8 rounded-[2rem] border-border/50 hover:border-primary/30 transition-all group cursor-pointer"
                        >
                           <Link href={`/blog/${post.id}`}>
                              <div className="flex justify-between items-start mb-6">
                                 <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                                    {post.category}
                                 </span>
                                 <span className="text-[10px] font-mono text-muted-foreground">{post.date}</span>
                              </div>
                              <h4 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                                 {post.title}
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                                 {post.excerpt}
                              </p>
                              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                 Read Article <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                           </Link>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>
          </motion.div>
        ) : step === 'simulator' ? (
          <motion.div 
            key="simulator"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="max-w-7xl mx-auto pb-20"
          >
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
               {/* Controls */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="fintech-card p-8 rounded-[2.5rem] border-border">
                     <h3 className="text-xl font-bold mb-8 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={18} className="text-primary" /> 
                        Your Context
                     </h3>
                     
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Annual Income (USD)</label>
                           <input 
                              type="number" 
                              className="w-full fintech-input border-border rounded-xl px-4 py-3 text-lg font-bold focus:border-primary outline-none transition-colors"
                              value={formData.income}
                              onChange={(e) => setFormData({...formData, income: Number(e.target.value)})}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Current Tax Rate (%)</label>
                           <input 
                              type="number" 
                              className="w-full fintech-input border-border rounded-xl px-4 py-3 text-lg font-bold focus:border-primary outline-none transition-colors"
                              value={formData.currentTax}
                              onChange={(e) => setFormData({...formData, currentTax: Number(e.target.value)})}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Current Monthly Living Cost ($)</label>
                           <input 
                              type="number" 
                              className="w-full fintech-input border-border rounded-xl px-4 py-3 text-lg font-bold focus:border-primary outline-none transition-colors"
                              value={formData.currentLivingCost}
                              onChange={(e) => setFormData({...formData, currentLivingCost: Number(e.target.value)})}
                           />
                        </div>
                        <div className="space-y-4 pt-4">
                           <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Select Strategy</p>
                           <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 no-scrollbar border-y border-border/50 py-4">
                              {nomadVisas.map(visa => (
                                 <button 
                                    key={visa.id}
                                    onClick={() => setSelectedCountry(visa.id)}
                                    className={`text-left px-4 py-4 rounded-2xl border transition-all ${
                                       selectedCountry === visa.id 
                                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                          : 'bg-muted/30 border-border/50 hover:border-white/20'
                                    }`}
                                 >
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="font-bold text-sm">{visa.name}</span>
                                       <span className={`text-[9px] uppercase tracking-widest font-black ${selectedCountry === visa.id ? 'text-white/70' : 'text-primary'}`}>{visa.continent}</span>
                                    </div>
                                    <p className={`text-[10px] ${selectedCountry === visa.id ? 'text-white/60' : 'text-muted-foreground'}`}>{visa.type}</p>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-6 bg-accent/5 rounded-3xl border border-accent/10 flex gap-4">
                     <Info className="text-accent shrink-0" size={20} />
                     <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        Calculations are based on prototypical data for 2026. Actual tax laws may vary. Consulting a local professional is recommended after initial screening.
                     </p>
                  </div>
               </div>

               {/* Results Dashboard */}
               <div className="lg:col-span-8 space-y-8">
                  <div className="fintech-card p-12 rounded-[3rem] border-border relative overflow-hidden h-full flex flex-col">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <TrendingDown size={320} />
                     </div>
                     
                     <div className="relative z-10 flex flex-col h-full">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                           <div>
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                    <MapPin size={16} />
                                 </div>
                                 <span className="text-xs font-black uppercase tracking-widest text-primary">{targetVisa.continent} ? {targetVisa.name}</span>
                              </div>
                              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                                 Real Wealth <br /> <span className="gradient-text">Increase</span>
                              </h2>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Total Annual Delta</p>
                              <p className="text-6xl md:text-8xl font-black tracking-tighter text-foreground tabular-nums">
                                 ${savings.total.toLocaleString()}
                              </p>
                              <div className="flex gap-4 mt-4 justify-end">
                                 <div className="text-right">
                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Tax Savings</p>
                                    <p className="text-primary font-bold">+${savings.tax.toLocaleString()}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Living Savings</p>
                                    <p className="text-accent font-bold">{savings.living > 0 ? '+' : ''}${savings.living.toLocaleString()}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 mb-16">
                           <div className="space-y-8">
                              <div>
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Visa Requirements</h4>
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                                       <span className="text-sm font-medium">Monthly Income Req.</span>
                                       <span className="font-bold">${targetVisa.minIncome.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                                       <span className="text-sm font-medium">Permit Duration</span>
                                       <span className="font-bold">{targetVisa.duration}</span>
                                    </div>
                                 </div>
                              </div>
                              <div>
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Tax Advantage</h4>
                                 <div className="p-6 bg-primary/10 rounded-2xl border border-primary/20 flex items-start gap-4">
                                    <CheckCircle2 className="text-primary shrink-0" size={20} />
                                    <p className="text-sm font-bold leading-relaxed">{targetVisa.taxBenefit}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-8">
                              <div>
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Process Difficulty</h4>
                                 <div className="flex items-center gap-6">
                                    <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden">
                                       <div 
                                          className={`h-full transition-all duration-1000 ${
                                             targetVisa.difficulty === 'Easy' ? 'w-1/3 bg-green-500' :
                                             targetVisa.difficulty === 'Medium' ? 'w-2/3 bg-primary' : 'w-full bg-accent'
                                          }`} 
                                       />
                                    </div>
                                    <span className="font-black uppercase tracking-widest text-xs italic">{targetVisa.difficulty}</span>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Expert Insights</h4>
                                 <div className="flex gap-4 p-4 rounded-2xl bg-muted/30 italic text-xs text-muted-foreground leading-relaxed">
                                    <AlertCircle size={16} className="shrink-0" />
                                    Nomads under this visa typically save 15-25% on living costs compared to SF/NYC/London. Digital infrastructure in {targetVisa.id === 'japan' ? 'Tokyo' : 'this region'} is top-tier.
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Pro Teaser */}
                        <div className="mt-auto p-8 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                              <ShieldCheck size={80} className="text-primary" />
                           </div>
                           <div className="relative z-10">
                              <h4 className="text-xl font-bold uppercase tracking-tight mb-2">Unlock Full Legal Guide</h4>
                              <p className="text-sm text-muted-foreground">Get the step-by-step application process, document checklist, and local tax setup guide.</p>
                           </div>
                           <button 
                              onClick={() => setIsProModalOpen(true)}
                              className="btn-primary whitespace-nowrap px-8 relative z-10 shadow-xl shadow-primary/30"
                           >
                              Upgrade to Pro <Zap size={16} />
                           </button>
                        </div>

                        <div className="mt-8 flex gap-4">
                           <button onClick={() => setStep('landing')} className="btn-secondary py-4 px-8 text-xs uppercase tracking-widest">
                              Back to Home
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : step === 'compare' ? (
          <motion.div
            key="compare"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="max-w-7xl mx-auto pb-20"
          >
             <div className="fintech-card p-12 rounded-[3rem] border-border ">
                <div className="flex items-center gap-4 mb-12">
                   <div className="p-4 bg-primary/20 rounded-2xl text-primary border border-primary/20">
                      <BarChart size={32} />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter italic">Country <span className="gradient-text">Comparison</span></h2>
                      <p className="text-muted-foreground text-sm">Compare 3 destinations side-by-side to find your optimal tax and lifestyle base.</p>
                   </div>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8">
                   {compareCountries.map((cId, idx) => {
                      const visa = nomadVisas.find(v => v.id === cId);
                      const taxSav = calculateTaxSavings(formData.income, formData.currentTax, cId);
                      const currentLiv = formData.currentLivingCost * 12;
                      const targetLiv = (visa?.monthlyLivingCost || 0) * 12;
                      const livSav = currentLiv - targetLiv;
                      const totalDelta = taxSav + livSav;
                      
                      return (
                         <div key={idx} className="bg-card p-8 rounded-3xl border border-border shadow-lg flex flex-col h-full relative overflow-hidden">
                            {/* Pro Lock Mockup */}
                            {idx === 2 && !isPro && (
                               <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center border border-primary/20 rounded-3xl">
                                  <Lock size={40} className="text-primary mb-4" />
                                  <h3 className="font-bold text-lg mb-2">Unlock Slot 3</h3>
                                  <p className="text-xs text-muted-foreground mb-4">Pro users can compare 3 countries simultaneously to find the absolute best setup.</p>
                                  <button onClick={() => setIsProModalOpen(true)} className="btn-primary py-2 px-6 text-xs">Upgrade to Pro</button>
                               </div>
                            )}
                            
                            {/* Selector */}
                            <select 
                               className="w-full bg-background border border-border rounded-xl p-3 text-sm font-bold uppercase tracking-widest text-primary mb-6 outline-none focus:border-primary/50 transition-colors cursor-pointer"
                               value={cId}
                               onChange={(e) => {
                                  const newArr = [...compareCountries];
                                  newArr[idx] = e.target.value;
                                  setCompareCountries(newArr);
                               }}
                            >
                               {nomadVisas.map(v => (
                                  <option key={v.id} value={v.id}>{v.name}</option>
                               ))}
                            </select>
                            
                            <div className="flex-1 space-y-6">
                               <div>
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Total Annual Savings</h4>
                                  <div className={`text-4xl font-black italic tracking-tighter ${totalDelta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                     {totalDelta > 0 ? '+' : ''}{totalDelta.toLocaleString()} USD
                                  </div>
                               </div>
                               
                               <div className="space-y-4">
                                  <div className="flex justify-between items-center text-sm border-b border-border/30 pb-2">
                                     <span className="text-muted-foreground">Tax Savings:</span>
                                     <span className="font-bold">{taxSav > 0 ? '+' : ''}{taxSav.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm border-b border-border/30 pb-2">
                                     <span className="text-muted-foreground">Living Savings:</span>
                                     <span className="font-bold">{livSav > 0 ? '+' : ''}{livSav.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm border-b border-border/30 pb-2">
                                     <span className="text-muted-foreground">Income Req:</span>
                                     <span className="font-bold">{visa.incomeRequirement}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm pt-2">
                                     <span className="text-muted-foreground">Local Tax Rate:</span>
                                     <span className="font-bold text-accent">{visa.taxRate}</span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-border/50">
                               <button 
                                  onClick={() => {
                                     setSelectedCountry(cId);
                                     setStep('simulator');
                                  }}
                                  className="w-full btn-secondary py-3 text-xs uppercase tracking-widest"
                               >
                                  Deep Dive Analysis
                               </button>
                            </div>
                         </div>
                      );
                   })}
                </div>

                <div className="mt-12 flex gap-4">
                   <button onClick={() => setStep('landing')} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-white px-4 transition-colors">
                      Back to Home
                   </button>
                </div>
             </div>
          </motion.div>
        ) : step === 'guide' ? (
          <motion.div 
            key="guide"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="pt-32 pb-40 px-6 max-w-6xl mx-auto"
          >
             <div className="fintech-card p-12 rounded-[3rem] border-border  relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                   <BookOpen size={320} />
                </div>
                <div className="flex items-center gap-4 mb-12 relative z-10">
                   <div className="p-4 bg-primary/20 rounded-2xl text-primary border border-primary/20">
                      <BookOpen size={32} />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter italic">How to <span className="gradient-text">Use ZenNomad</span></h2>
                      <p className="text-muted-foreground text-sm">Your step-by-step guide to financial and location independence.</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12 relative z-10">
                   <div className="bg-card p-8 rounded-3xl border border-border shadow-lg">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-xl mb-6">1</div>
                      <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Simulate Savings</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Enter your current income, tax rate, and living costs in the "Check Savings" tool. We instantly calculate your Real Wealth Increase by comparing your setup to top digital nomad visas.</p>
                   </div>
                   <div className="bg-card p-8 rounded-3xl border border-border shadow-lg">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-xl mb-6">2</div>
                      <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Track 183-Day Rule</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Most countries consider you a tax resident if you stay over 183 days. Use the "183-Day Tracker" to log your trips. We provide a visual risk radar so you never accidentally trigger tax residency.</p>
                   </div>
                   <div className="bg-card p-8 rounded-3xl border border-border shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><Lock size={80} /></div>
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-xl mb-6 relative z-10">3</div>
                      <h3 className="text-lg font-bold uppercase tracking-tight mb-4 relative z-10">Execute with Pro</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed relative z-10">Once you choose a destination, upgrade to Pro to unlock the exact legal blueprints, step-by-step application checklists, and local tax setup guides to make your move seamless.</p>
                   </div>
                </div>

                <div className="mt-8 flex gap-4 items-center relative z-10">
                   <button onClick={() => setStep('simulator')} className="btn-primary py-4 px-8 text-sm">
                      Start Simulation
                   </button>
                   <button onClick={() => setStep('tracker')} className="btn-secondary py-4 px-8 text-sm">
                      Open Tracker
                   </button>
                   <button onClick={() => setStep('landing')} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-white px-4 transition-colors">
                      Back to Home
                   </button>
                </div>
             </div>
          </motion.div>
        ) : step === 'tracker' ? (
          <motion.div 
            key="tracker"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="max-w-5xl mx-auto pb-20"
          >
             <div className="fintech-card p-12 rounded-[3rem] border-border ">
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-4 bg-primary/20 rounded-2xl text-primary border border-primary/20">
                      <Calendar size={32} />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter italic">183-Day <span className="gradient-text">Tracker</span></h2>
                      <p className="text-muted-foreground text-sm">100% Local-First. Your travel history never leaves this browser.</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                   {/* Add Trip Form */}
                   <div className="space-y-6 bg-card p-8 rounded-[2rem] border border-border">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Log a Trip</h3>
                      <div className="space-y-4">
                         <div>
                            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Country</label>
                            <select 
                               className="w-full fintech-input border-border rounded-xl px-4 py-3 text-sm font-bold focus:border-primary outline-none"
                               value={newTrip.country}
                               onChange={(e) => setNewTrip({...newTrip, country: e.target.value})}
                            >
                               {nomadVisas.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                            </select>
                         </div>
                         <div className="flex gap-4">
                            <div className="w-1/2">
                               <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Start</label>
                               <input type="date" className="w-full fintech-input border-border rounded-xl px-4 py-3 text-sm font-bold" value={newTrip.startDate} onChange={e => setNewTrip({...newTrip, startDate: e.target.value})} />
                            </div>
                            <div className="w-1/2">
                               <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">End</label>
                               <input type="date" className="w-full fintech-input border-border rounded-xl px-4 py-3 text-sm font-bold" value={newTrip.endDate} onChange={e => setNewTrip({...newTrip, endDate: e.target.value})} />
                            </div>
                         </div>
                         <button onClick={addTrip} className="btn-primary w-full py-4 mt-2"><Plus size={16} /> Add Trip</button>
                      </div>
                   </div>

                   {/* Dashboard */}
                   <div className="space-y-8">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Residency Risk Radar</h3>
                      <div className="space-y-6">
                         {Object.entries(daysByCountry).map(([country, days]) => {
                            const percent = Math.min((days / 183) * 100, 100);
                            const isDanger = days > 160;
                            return (
                               <div key={country} className="space-y-2">
                                  <div className="flex justify-between text-sm font-bold">
                                     <span>{country}</span>
                                     <span className={isDanger ? 'text-accent' : 'text-primary'}>{days} / 183 Days</span>
                                  </div>
                                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                     <div 
                                        className={`h-full rounded-full ${isDanger ? 'bg-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-primary'}`} 
                                        style={{ width: `${percent}%` }}
                                     />
                                  </div>
                               </div>
                            );
                         })}
                         {Object.keys(daysByCountry).length === 0 && (
                            <p className="text-muted-foreground text-sm italic">No trips logged yet. Start adding trips to monitor your tax residency risk.</p>
                         )}
                      </div>
                   </div>
                </div>

                <div className="mt-12 flex gap-4">
                   <button onClick={() => setStep('landing')} className="btn-secondary py-4 px-8 text-xs uppercase tracking-widest">
                      Back to Home
                   </button>
                </div>
             </div>
          </motion.div>
        ) : step === 'pro-dashboard' && isPro ? (
          <motion.div
            key="pro-dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="max-w-7xl mx-auto pb-20"
          >
             <div className="fintech-card p-12 rounded-[3rem] border-primary/30 ">
                <div className="flex items-center gap-4 mb-12">
                   <div className="p-4 bg-primary/20 rounded-2xl text-primary border border-primary/20">
                      <CheckCircle2 size={32} />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter italic">Pro <span className="gradient-text">Dashboard</span></h2>
                      <p className="text-muted-foreground text-sm">Welcome to your secure execution hub. All premium features are unlocked.</p>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                   <div className="bg-card p-8 rounded-3xl border border-primary/20">
                      <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Visa Blueprints</h3>
                      <p className="text-sm text-muted-foreground mb-6">Download the exact step-by-step checklist and legal requirements for your selected destination.</p>
                      <button className="btn-primary w-full py-3 text-sm flex justify-center items-center gap-2">
                         Download Malaysia Guide (PDF)
                      </button>
                   </div>
                   <div className="bg-card p-8 rounded-3xl border border-primary/20">
                      <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Tax Setup Guides</h3>
                      <p className="text-sm text-muted-foreground mb-6">Learn how to legally structure your corporate entities (e.g. US LLC) to achieve 0% tax safely.</p>
                      <button className="btn-secondary w-full py-3 text-sm border-primary/30 text-primary flex justify-center items-center gap-2">
                         Read US LLC Guide
                      </button>
                   </div>
                </div>

                <div className="mt-8 flex gap-4">
                   <button onClick={() => setStep('compare')} className="btn-secondary py-4 px-8 text-xs uppercase tracking-widest">
                      Open 3-Country Comparison
                   </button>
                   <button onClick={() => setStep('landing')} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-white px-4 transition-colors">
                      Back to Home
                   </button>
                </div>
             </div>
          </motion.div>
        ) : null}
            </AnimatePresence>
         </div>
      </div>

      {/* Pro Modal Mockup */}
      <AnimatePresence>
         {isProModalOpen && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
               onClick={() => setIsProModalOpen(false)}
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="fintech-card p-12 rounded-[3rem] max-w-lg w-full border-primary/30 text-center relative"
                  onClick={e => e.stopPropagation()}
               >
                  <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary border border-primary/30">
                     <Lock size={40} />
                  </div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Pro Access Required</h3>
                  <p className="text-muted-foreground mb-10 leading-relaxed">
                     Unlock personalized Visa Checklists, Step-by-Step guides, and the 3-Country Comparison Tool.
                  </p>
                  
                  {!showKeyInput ? (
                     <div className="space-y-4">
                        <button onClick={() => window.open('https://yhanster206.gumroad.com/l/rpfze', '_blank')} className="btn-primary w-full py-4 text-lg">
                           Get Pro Access — $15
                        </button>
                        <button 
                           onClick={() => setShowKeyInput(true)}
                           className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-bold hover:text-foreground transition-colors block w-full text-center"
                        >
                           I already have a license key
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        <input 
                           type="text" 
                           placeholder="Enter your license key (e.g. ZEN-PRO-2026)" 
                           className="w-full fintech-input rounded-xl p-4 text-center font-mono focus:border-primary outline-none transition-colors"
                           value={licenseKey}
                           onChange={e => setLicenseKey(e.target.value)}
                        />
                        {verifyError && <p className="text-red-400 text-xs font-bold">{verifyError}</p>}
                        <button 
                           onClick={handleVerify}
                           disabled={isVerifying}
                           className="btn-primary w-full py-4 text-lg disabled:opacity-50 flex justify-center items-center"
                        >
                           {isVerifying ? 'Verifying...' : 'Unlock Pro'}
                        </button>
                        <button 
                           onClick={() => setShowKeyInput(false)}
                           className="text-muted-foreground text-xs uppercase tracking-[0.2em] font-bold hover:text-white transition-colors block w-full text-center"
                        >
                           Back to purchase
                        </button>
                     </div>
                  )}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Footer */}
      {!isAppView && (
         <footer className="py-20 px-6 border-t border-border/50 bg-card">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Globe size={16} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase">ZenNomad</span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            </div>
            <p className="text-[10px] text-muted-foreground/30 font-mono uppercase tracking-widest">
                c 2026 ZenNomad. Zero Data, Pure Freedom.
            </p>
        </div>
         </footer>
      )}
    </main>
  );
}
