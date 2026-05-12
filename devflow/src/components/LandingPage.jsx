import React from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  FileCode, 
  CheckSquare, 
  ArrowRight,
  Database,
  Lock,
  ChevronRight,
  Sparkles,
  Target,
  ArrowDown,
  BrainCircuit,
  Command,
  Monitor,
  Activity,
  Split,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const onStart = () => navigate('/app');

  const problems = [
    { 
      id: 1, 
      title: 'Zero Installation', 
      desc: 'No heavy apps or slow setup. Open your browser and you are ready. DevFlow is built for speed and immediate productivity.' 
    },
    { 
      id: 2, 
      title: 'AI Agnostic', 
      desc: 'Pieces and others lock you in. DevFlow treats all AIs as equals. ChatGPT, Claude, Gemini, or Local LLMs—they all live here.' 
    },
    { 
      id: 3, 
      title: 'Project Centric', 
      desc: 'A single page for your entire project. Logs, files, tasks, and progress—all integrated into a single high-performance view.' 
    }
  ];

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-primary/30 min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-[60] bg-black/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Rocket size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">DevFlow<span className="text-primary">.</span></span>
          </div>
          <div className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <a href="#problem" className="hover:text-primary transition-colors">Problem</a>
            <a href="#solution" className="hover:text-primary transition-colors">Solution</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <span className="text-primary font-mono text-[10px] select-all border border-primary/20 px-3 py-1 rounded-full bg-primary/5">yhan86818@gmail.com</span>
            <a href="https://privacy-money-portal.pages.dev/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">DevHub</a>
          </div>
          <button onClick={onStart} className="bg-white text-black px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5">
            Get Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Animated Glow Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full pointer-events-none z-0 opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full pointer-events-none z-0 opacity-50" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles size={14} className="animate-pulse" />
              The AI-First Command Center
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8 uppercase italic">
              No Install.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">No Lock-in.</span> <br />
              <span className="text-primary">Any AI.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl leading-tight font-medium">
              The lightweight, browser-based command center for all your AI work. Seamlessly integrate ChatGPT, Claude, and Gemini into one private project view.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button onClick={onStart} className="bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl uppercase tracking-tight shadow-2xl shadow-primary/40 hover:translate-y-[-4px] transition-all flex items-center justify-center gap-3">
                Launch DevFlow
                <ArrowRight size={24} />
              </button>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status: Open Beta</span>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold">100% Free & Local-First</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.3)] bg-black/40 backdrop-blur-md p-1">
                <img 
                    src="/assets/hero.png" 
                    alt="DevFlow Hero Visualization" 
                    className="w-full h-auto rounded-[2.8rem] opacity-90 hover:scale-105 transition-transform duration-1000"
                />
            </div>
            {/* Floating Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 glass rounded-3xl rotate-12 flex items-center justify-center border-white/10 z-20 hidden md:flex">
                <BrainCircuit size={40} className="text-primary" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 glass rounded-3xl -rotate-12 flex items-center justify-center border-white/10 z-20 hidden md:flex">
                <Activity size={40} className="text-accent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section - BOLD & AGGRESSIVE */}
      <section id="problem" className="py-40 px-6 relative border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5">
                <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase italic leading-none tracking-tighter">
                    Why <br/><span className="text-primary">DevFlow?</span>
                </h2>
                <p className="text-2xl text-muted-foreground leading-tight mb-12">
                    Modern development is 80% prompting and 20% coding. But your tools are still stuck in the 20% era.
                </p>
                <div className="space-y-4">
                    {['Zero Setup / Browser-Only', 'AI Agnostic (Any Model)', '1 Project = 1 Command Center', '100% Privacy & Local-First'].map(t => (
                        <div key={t} className="flex items-center gap-4 text-xl font-bold italic opacity-40">
                            <Zap size={20} className="text-primary" />
                            {t}
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-7 grid md:grid-cols-2 gap-8">
              {problems.map((p) => (
                <div key={p.id} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group">
                  <div className="text-4xl font-black text-primary/20 mb-6 group-hover:text-primary transition-colors">0{p.id}</div>
                  <h3 className="text-2xl font-black mb-4 uppercase italic">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Visual Showcase */}
      <section id="solution" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-9xl font-black mb-8 uppercase italic leading-none tracking-tighter">
                The <span className="text-primary">Shift.</span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
                DevFlow transforms your browser into a local-first development vault.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass rounded-[3rem] p-12 border border-white/10 flex flex-col justify-between overflow-hidden relative group">
                <div className="relative z-10">
                    <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-8 text-primary">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-4xl font-black mb-6 uppercase italic tracking-tight">Visual AI Logs</h3>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-md mb-8">
                        Every breakthrough is preserved. DevFlow organizes your AI conversations into a searchable, taggable timeline.
                    </p>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/5">#bugfix</div>
                        <div className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/5">#refactor</div>
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                    <Monitor size={400} className="text-primary" />
                </div>
            </div>

            <div className="glass rounded-[3rem] p-12 border border-white/10 flex flex-col justify-between group">
                <div>
                    <div className="p-3 bg-accent/10 rounded-2xl w-fit mb-8 text-accent">
                        <FileCode size={32} />
                    </div>
                    <h3 className="text-4xl font-black mb-6 uppercase italic tracking-tight">Smart Vault</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        Version your AI code. v1 to vN history with side-by-side diff comparison.
                    </p>
                </div>
                <div className="flex items-center justify-center p-8 bg-white/5 rounded-[2rem] border border-white/5">
                    <Split size={48} className="text-accent opacity-50 group-hover:scale-125 transition-transform duration-700" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section - Premium Graphics */}
      <section id="privacy" className="py-40 px-6 bg-[#080808] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
             <div className="order-2 lg:order-1">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full z-0" />
                    <img 
                        src="/assets/privacy.png" 
                        alt="Privacy Visualization" 
                        className="relative z-10 w-full h-auto rounded-[3rem] border border-white/10"
                    />
                </div>
             </div>
             <div className="order-1 lg:order-2 space-y-10">
                <div className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-xs">
                    <Lock size={16} />
                    Zero-Server Architecture
                </div>
                <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter">
                    My Eyes <br/><span className="text-primary">Only.</span>
                </h2>
                <p className="text-2xl text-muted-foreground leading-tight">
                    DevFlow uses IndexedDB to store your data locally. We don't have a database, and we don't have servers.
                </p>
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                        <h4 className="font-black uppercase italic mb-2">Private</h4>
                        <p className="text-xs text-muted-foreground">Local storage only.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                        <h4 className="font-black uppercase italic mb-2">Secure</h4>
                        <p className="text-xs text-muted-foreground">No cloud sync.</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-60 px-6 text-center relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[150px] pointer-events-none z-0" />
         <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-7xl md:text-9xl font-black mb-12 uppercase italic leading-none tracking-tighter">
                Ship <br/><span className="text-primary">Faster.</span>
            </h2>
            <button onClick={onStart} className="bg-white text-black px-16 py-8 rounded-[2rem] font-black text-2xl uppercase tracking-tighter hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-white/20 flex items-center justify-center gap-4 mx-auto">
                <Rocket size={32} />
                Enter Command Center
            </button>
            <p className="mt-12 text-muted-foreground font-bold uppercase tracking-widest text-xs">
                Free Open Beta • No Account Required
            </p>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Rocket size={16} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase">DevFlow</span>
            </div>
           <p>© 2026 devflow.app / local-first dev ops</p>
           <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-primary font-mono select-all">yhan86818@gmail.com</span>
                <a href="https://privacy-money-portal.pages.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Portal</a>
                <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            </div>
            <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-widest">
                © 2026 devflow.app / local-first dev ops
            </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
