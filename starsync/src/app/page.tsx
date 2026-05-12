"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquareWarning, TrendingUp, Link as LinkIcon, QrCode, ArrowRight, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';

export default function StarSyncApp() {
  const [view, setView] = useState('landing'); // 'landing', 'dashboard', 'survey'

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      
      {/* Top Navigation */}
      {view !== 'survey' && (
        <nav className="fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
              <Star size={18} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black tracking-tight">StarSync</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setView('survey')} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4">
              Demo: Customer Survey
            </button>
            <button onClick={() => setView('dashboard')} className="btn-primary py-2 px-6 text-sm">
              Dashboard Login
            </button>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <div className={view !== 'survey' ? "pt-24 pb-20" : ""}>
        <AnimatePresence mode="wait">
          
          {/* =========================================
              VIEW 1: LANDING PAGE (For Business Owners)
              ========================================= */}
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto px-6 dot-grid min-h-[80vh] flex flex-col justify-center">
              <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-8 border border-accent/20">
                  <ShieldCheck size={16} /> Protect your online reputation
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-primary leading-tight">
                  Multiply 5-Star Reviews. <br />
                  <span className="text-muted-foreground">Intercept the Bad Ones.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                  StarSync automatically asks your customers for feedback. We send happy customers to Google Maps, and catch unhappy customers privately before they ruin your reputation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setView('dashboard')} className="btn-primary text-lg px-8 py-4">
                    Start 14-Day Free Trial
                  </button>
                  <button onClick={() => setView('survey')} className="btn-secondary text-lg px-8 py-4">
                    Try the Live Demo
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="fintech-card p-8 rounded-3xl">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                    <Star size={24} className="fill-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Boost Google Rankings</h3>
                  <p className="text-muted-foreground leading-relaxed">Automatically direct 4 and 5-star ratings straight to your Google Business profile.</p>
                </div>
                <div className="fintech-card p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full" />
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6 relative z-10">
                    <MessageSquareWarning size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 relative z-10">Intercept Bad Reviews</h3>
                  <p className="text-muted-foreground leading-relaxed relative z-10">1 to 3-star ratings are kept completely private, giving you a chance to make it right.</p>
                </div>
                <div className="fintech-card p-8 rounded-3xl">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">More Revenue</h3>
                  <p className="text-muted-foreground leading-relaxed">Local businesses with a 4.8+ rating earn 54% more revenue than competitors.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================
              VIEW 2: DASHBOARD (For Business Owners)
              ========================================= */}
          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-primary">Overview</h2>
                  <p className="text-muted-foreground mt-1">Dr. Smith Dental Clinic</p>
                </div>
                <div className="flex gap-3">
                  <button className="btn-secondary py-2 text-sm" onClick={() => alert('Copied Link: https://starsync.app/drsmith')}>
                    <LinkIcon size={16} /> Copy Survey Link
                  </button>
                  <button className="btn-primary py-2 text-sm bg-primary">
                    <QrCode size={16} /> Print QR Code
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="fintech-card p-6 rounded-3xl border-t-4 border-t-accent">
                  <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Total Scans</p>
                  <p className="text-4xl font-black text-primary tabular-nums">1,248</p>
                </div>
                <div className="fintech-card p-6 rounded-3xl border-t-4 border-t-green-500">
                  <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Google Reviews Sent</p>
                  <p className="text-4xl font-black text-green-600 tabular-nums">312</p>
                  <p className="text-xs text-green-600 mt-2 font-bold">+12% this month</p>
                </div>
                <div className="fintech-card p-6 rounded-3xl border-t-4 border-t-red-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full" />
                  <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider relative z-10">Disasters Prevented</p>
                  <p className="text-4xl font-black text-red-600 tabular-nums relative z-10">18</p>
                  <p className="text-xs text-red-600 mt-2 font-bold relative z-10">Intercepted 1-Star</p>
                </div>
                <div className="fintech-card p-6 rounded-3xl">
                  <p className="text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Avg Rating</p>
                  <div className="flex items-center gap-2">
                    <p className="text-4xl font-black text-primary tabular-nums">4.9</p>
                    <Star size={24} className="fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Intercepted Feedback List */}
              <h3 className="text-xl font-bold mb-6 text-primary">Requires Attention (Private Feedback)</h3>
              <div className="fintech-card rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-gray-50/50">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        <Star size={16} className="fill-yellow-400" /><Star size={16} className="fill-yellow-400" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">Today at 2:15 PM</span>
                    </div>
                    <p className="text-primary font-medium">"Wait time was over 45 minutes past my appointment. The front desk was rude."</p>
                  </div>
                  <button className="btn-secondary text-xs px-4 py-2">Resolve</button>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-400">
                        <Star size={16} className="fill-yellow-400" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">Yesterday</span>
                    </div>
                    <p className="text-primary font-medium">"Hygienist was too rough. My gums are still bleeding."</p>
                  </div>
                  <button className="btn-secondary text-xs px-4 py-2">Resolve</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================
              VIEW 3: SURVEY DEMO (For the End Customer)
              ========================================= */}
          {view === 'survey' && <SurveyComponent onClose={() => setView('landing')} />}
          
        </AnimatePresence>
      </div>
    </main>
  );
}

// Sub-component for the Survey logic
function SurveyComponent({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number | null>(null);
  const [step, setStep] = useState('rating'); // 'rating', 'positive', 'negative', 'done'

  const handleRating = (val: number) => {
    setRating(val);
    setTimeout(() => {
      if (val >= 4) setStep('positive');
      else setStep('negative');
    }, 400);
  };

  return (
    <motion.div key="survey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md fintech-card p-8 rounded-[2rem] text-center relative overflow-hidden">
        
        {/* Close Button for Demo */}
        <button onClick={onClose} className="absolute top-4 right-4 text-xs font-bold text-muted-foreground hover:text-foreground">
          Close Demo
        </button>

        <AnimatePresence mode="wait">
          {step === 'rating' && (
            <motion.div key="r" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="text-accent fill-accent" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-primary">How was your visit?</h2>
              <p className="text-muted-foreground mb-8">We value your feedback at Dr. Smith Dental Clinic.</p>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`p-2 transition-transform hover:scale-110 active:scale-95 ${rating && rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                  >
                    <Star size={40} className={rating && rating >= star ? 'fill-yellow-400' : 'fill-gray-200'} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'positive' && (
            <motion.div key="p" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2 text-primary">Awesome!</h2>
              <p className="text-muted-foreground mb-8">We're so glad you had a 5-star experience. Would you mind sharing it on Google?</p>
              
              <button 
                onClick={() => setStep('done')}
                className="w-full btn-primary bg-[#4285F4] hover:bg-[#3367D6] py-4 text-lg"
              >
                Leave a Google Review
              </button>
            </motion.div>
          )}

          {step === 'negative' && (
            <motion.div key="n" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-black mb-2 text-primary">We're sorry.</h2>
              <p className="text-muted-foreground mb-6">How could we have made your experience better?</p>
              
              <textarea 
                className="w-full fintech-input rounded-2xl p-4 min-h-[120px] mb-4 text-sm"
                placeholder="Tell us what went wrong... (This goes directly to the manager)"
              />
              <button 
                onClick={() => setStep('done')}
                className="w-full btn-primary py-4"
              >
                Send Private Feedback
              </button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="d" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2 text-primary">Thank you!</h2>
              <p className="text-muted-foreground">Your feedback has been received.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
