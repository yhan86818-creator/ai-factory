"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ShieldCheck, Zap, Lock, Copy, Settings2, Play, Download, ArrowRight, Github } from 'lucide-react';

export default function DevFlowApp() {
  const [view, setView] = useState('landing'); // 'landing', 'app'

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Code2 size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">TypeFlow</span>
          <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:block">Local-First</span>
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors hidden sm:block px-4">
            Documentation
          </button>
          <button onClick={() => setView('app')} className="btn-primary py-2 px-6 text-sm">
            Launch Editor
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-24 pb-20">
        <AnimatePresence mode="wait">
          
          {/* =========================================
              VIEW 1: LANDING PAGE (Security & Value Prop)
              ========================================= */}
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto px-6 dot-grid min-h-[80vh] flex flex-col justify-center">
              <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 font-bold text-sm mb-8 border border-green-500/20">
                  <ShieldCheck size={16} /> 100% Offline. Zero Tracking. Enterprise Safe.
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-primary leading-tight">
                  Stop pasting company secrets <br />
                  <span className="text-muted-foreground">into random web tools.</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                  TypeFlow is a secure, local-first workflow engine. Paste your JSON API responses and instantly generate TypeScript Interfaces, Zod Schemas, and React Query hooks—without a single byte ever leaving your browser.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setView('app')} className="btn-primary text-lg px-8 py-4">
                    Open Secure Editor <ArrowRight size={20} />
                  </button>
                  <button onClick={() => window.open('https://github.com/yourusername/typeflow', '_blank')} className="btn-secondary text-lg px-8 py-4">
                    <Github size={20} /> View Source
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="dev-card p-8 rounded-3xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Military-Grade Privacy</h3>
                  <p className="text-muted-foreground leading-relaxed">No databases. No API calls. Disconnect your Wi-Fi and it still works perfectly. Your proprietary JSON payloads are safe.</p>
                </div>
                <div className="dev-card p-8 rounded-3xl">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Instant Generation</h3>
                  <p className="text-muted-foreground leading-relaxed">Don't just format JSON. Instantly output production-ready Zod validation schemas and typed fetch hooks for Next.js.</p>
                </div>
                <div className="dev-card p-8 rounded-3xl border-2 border-accent/20 relative overflow-hidden bg-accent/5">
                  <div className="absolute top-4 right-4 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Pro</div>
                  <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6 relative z-10">
                    <Settings2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 relative z-10">Custom Exporters</h3>
                  <p className="text-muted-foreground leading-relaxed relative z-10">Define your own AST templates. Export directly to Prisma models, GraphQL types, or custom internal company formats.</p>
                  <button className="mt-4 text-sm font-bold text-accent hover:underline flex items-center gap-1">Upgrade for $49 <ArrowRight size={14}/></button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================
              VIEW 2: THE APP (Local-First Editor)
              ========================================= */}
          {view === 'app' && <EditorComponent />}
          
        </AnimatePresence>
      </div>
    </main>
  );
}

// Sub-component for the Editor Interface
function EditorComponent() {
  const [jsonInput, setJsonInput] = useState('{\n  "user_id": "usr_12345",\n  "email": "dev@example.com",\n  "is_active": true,\n  "preferences": {\n    "theme": "dark",\n    "notifications": false\n  }\n}');
  const [outputTab, setOutputTab] = useState('typescript'); // 'typescript', 'zod', 'hook'
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Mock Generators
  const generatedTS = `export interface UserResponse {
  user_id: string;
  email: string;
  is_active: boolean;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}`;

  const generatedZod = `import { z } from "zod";

export const UserSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  is_active: z.boolean(),
  preferences: z.object({
    theme: z.string(),
    notifications: z.boolean(),
  }),
});

export type User = z.infer<typeof UserSchema>;`;

  const generatedHook = `import { useQuery } from '@tanstack/react-query';
import { UserSchema, type User } from './schema';

export function useUser(userId: string) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(\`/api/users/\${userId}\`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      // Safely validate runtime data
      return UserSchema.parse(data);
    },
  });
}`;

  const currentOutput = outputTab === 'typescript' ? generatedTS : outputTab === 'zod' ? generatedZod : generatedHook;

  return (
    <motion.div key="app" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[1400px] mx-auto px-4 md:px-8 h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      
      {/* Left Pane: Input */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-2">
            <Code2 size={16} /> JSON Input
          </h2>
          <button className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
            <Play size={12} /> Format
          </button>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="flex-1 dev-input rounded-2xl p-6 text-sm resize-none focus:outline-none w-full"
          spellCheck={false}
        />
      </div>

      {/* Right Pane: Output */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between items-center mb-3 border-b border-border pb-2">
          <div className="flex gap-4">
            {['typescript', 'zod', 'hook'].map((tab) => (
              <button
                key={tab}
                onClick={() => setOutputTab(tab)}
                className={`text-sm font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${outputTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {tab === 'hook' ? 'React Query' : tab}
              </button>
            ))}
          </div>
          <button onClick={handleCopy} className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted px-3 py-1.5 rounded-lg transition-colors">
            {isCopied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />} {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex-1 dev-card rounded-2xl p-6 bg-slate-900 text-slate-50 overflow-hidden flex flex-col relative">
           {/* Fake syntax highlighting container */}
          <pre className="font-mono text-sm leading-relaxed overflow-y-auto flex-1 no-scrollbar">
            <code>{currentOutput}</code>
          </pre>
          
          {/* Pro Upsell Overlay (Example) */}
          {outputTab === 'hook' && (
            <div className="absolute bottom-4 right-4 bg-white text-slate-900 p-4 rounded-xl shadow-2xl border border-slate-200 max-w-xs">
               <p className="text-xs font-bold mb-2 flex items-center gap-2"><Settings2 size={14} className="text-accent" /> Pro Feature Unlock</p>
               <p className="text-[10px] text-slate-600 mb-3">Want to export this directly to a .ts file or sync with your GitHub repo?</p>
               <button className="w-full bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors">
                  Upgrade to Pro ($49)
               </button>
            </div>
          )}
        </div>
      </div>
      
    </motion.div>
  );
}
