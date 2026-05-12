'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileCode, 
  CheckSquare, 
  Lightbulb, 
  Plus, 
  Search, 
  Settings, 
  Download, 
  Upload, 
  Menu,
  X,
  PlusCircle,
  Clock,
  FolderOpen,
  Home,
  HelpCircle,
  Trash2,
  ExternalLink,
  Cpu,
  Command,
  Palette,
  Copy,
  Check,
  Split,
  Rocket
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDevFlow } from '../hooks/useDevFlow';
import { dbOps } from '../lib/db';
import Dashboard from './Dashboard';
import ConversationLogs from './ConversationLogs';
import FileVault from './FileVault';
import TaskList from './TaskList';
import KnowledgeBase from './KnowledgeBase';
import ProjectModal from './ProjectModal';
import LogModal from './LogModal';
import AILinksModal from './AILinksModal';
import { BlogList, BlogPost } from './Blog';
import { blogPosts } from '../data/blogPosts';

const DashboardView = ({ activeTab: initialTab = 'dashboard', activeBlogId }) => {
  const router = useRouter();
  const { 
    projects, 
    currentProject, 
    setCurrentProject, 
    logs, 
    files, 
    tasks, 
    knowledge, 
    aiLinks,
    loading,
    addProject,
    deleteProject,
    addLog,
    addFile,
    addTask,
    toggleTask,
    addKnowledge,
    addAiLink,
    deleteAiLink,
    refreshData,
    isPro,
    licenseKey,
    activatePro,
  } = useDevFlow();

  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAiLinksModalOpen, setIsAiLinksModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  
  // Theme & Search State
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  const themes = [
    { id: 'default', name: 'Indigo Night', color: 'bg-[#6366f1]' },
    { id: 'midnight', name: 'Deep Midnight', color: 'bg-[#8b5cf6]' },
    { id: 'slate', name: 'Ocean Slate', color: 'bg-[#38bdf8]' },
    { id: 'forest', name: 'Emerald Forest', color: 'bg-[#22c55e]' }
  ];

  useEffect(() => {
    document.body.className = theme !== 'default' ? `theme-${theme}` : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setIsLogModalOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // すでにインストール済みの場合は表示しないようにするなどの配慮
      setShowInstallBanner(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'logs', label: 'AI Logs', icon: MessageSquare },
    { id: 'files', label: 'File Vault', icon: FileCode },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'knowledge', label: 'Knowledge', icon: Lightbulb },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'guide', label: 'Guide', icon: HelpCircle },
  ];

  const handleExport = async () => {
    const data = {
      projects: await dbOps.getAll('projects'),
      logs: await dbOps.getAll('logs'),
      files: await dbOps.getAll('files'),
      tasks: await dbOps.getAll('tasks'),
      knowledge: await dbOps.getAll('knowledge'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        for (const project of data.projects || []) await dbOps.update('projects', project);
        for (const log of data.logs || []) await dbOps.update('logs', log);
        for (const file of data.files || []) await dbOps.update('files', file);
        for (const task of data.tasks || []) await dbOps.update('tasks', task);
        for (const item of data.knowledge || []) await dbOps.update('knowledge', item);
        window.location.reload();
      } catch (err) {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const searchResults = globalSearch ? logs.filter(l => 
    l.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
    (l.prompt || '').toLowerCase().includes(globalSearch.toLowerCase())
  ).slice(0, 5) : [];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative w-full max-w-2xl glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-white/5 flex items-center gap-4">
              <Search className="text-muted-foreground" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search logs, prompts, files... (Esc to close)"
                className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-lg"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
              <div className="px-2 py-1 bg-secondary rounded text-[10px] font-bold text-muted-foreground">ESC</div>
            </div>
            {globalSearch && (
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {searchResults.map(result => (
                  <button 
                    key={result.id}
                    onClick={() => { setActiveTab('logs'); setIsSearchOpen(false); }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-colors group mb-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-primary">{result.title}</h4>
                      <span className="text-[10px] uppercase text-muted-foreground">{new Date(result.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">"{result.prompt}"</p>
                  </button>
                ))}
                {searchResults.length === 0 && <p className="text-center py-8 text-muted-foreground">No results found.</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0'
        } fixed lg:relative transition-all duration-300 ease-in-out glass border-r border-border flex flex-col h-full z-40 overflow-hidden`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DevFlow
          </h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-6 no-scrollbar">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-all"
            >
              <Home size={18} />
              <span className="truncate text-sm font-medium">Exit to Home</span>
            </button>
            
            <button
              onClick={async () => {
                const pid = 'sample-' + Date.now();
                const sample = {
                  id: pid,
                  name: '🌤 Weather App',
                  description: 'A sample project loaded by DevFlow.',
                  goal: 'Build a beautiful weather forecast app using React and Tailwind.',
                  progress: 65,
                  status: 'In Progress',
                  createdAt: new Date().toISOString()
                };
                await dbOps.add('projects', sample);
                // Add sample logs
                await dbOps.add('logs', { projectId: pid, title: 'Set up React + Vite', prompt: 'How do I scaffold a new Vite project with TypeScript?', result: 'Run: npm create vite@latest my-app -- --template react-ts', status: 'success', timestamp: new Date().toISOString(), tags: ['setup'] });
                await dbOps.add('logs', { projectId: pid, title: 'Fix CORS error on /weather', prompt: 'Getting CORS error when calling OpenWeather API', result: 'Add a proxy in vite.config.ts: server: { proxy: { "/api": "https://api.openweathermap.org" } }', status: 'success', timestamp: new Date(Date.now() - 3600000).toISOString(), tags: ['bugfix'] });
                await dbOps.add('logs', { projectId: pid, title: 'Geolocation hook', prompt: 'Create a custom hook to get user\'s lat/lng', result: 'Used navigator.geolocation.getCurrentPosition wrapped in a Promise inside useEffect.', status: 'success', timestamp: new Date(Date.now() - 7200000).toISOString(), tags: ['feature'] });
                // Add sample tasks
                await dbOps.add('tasks', { projectId: pid, text: 'Add 5-day forecast panel', completed: false, type: 'todo', createdAt: new Date().toISOString() });
                await dbOps.add('tasks', { projectId: pid, text: 'Style the temperature unit toggle (°C/°F)', completed: false, type: 'todo', createdAt: new Date().toISOString() });
                await dbOps.add('tasks', { projectId: pid, text: 'Deploy to Vercel', completed: false, type: 'todo', createdAt: new Date().toISOString() });
                await dbOps.add('tasks', { projectId: pid, text: 'Set up React + Vite', completed: true, type: 'todo', createdAt: new Date().toISOString() });
                await dbOps.add('tasks', { projectId: pid, text: 'How to handle API errors?', completed: false, type: 'ai_ask', createdAt: new Date().toISOString() });
                // Add sample knowledge
                await dbOps.add('knowledge', { projectId: pid, title: 'Vite proxy config', content: 'In vite.config.ts: server.proxy maps local /api to remote origin — avoids CORS in dev.', tags: ['vite', 'config'], createdAt: new Date().toISOString() });
                await dbOps.add('knowledge', { projectId: pid, title: 'OpenWeather API key env var', content: 'Store as VITE_OWM_KEY in .env.local. Access via import.meta.env.VITE_OWM_KEY.', tags: ['env', 'api', 'template'], createdAt: new Date().toISOString() });
                window.location.reload();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-primary bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all"
            >
              <PlusCircle size={18} />
              <span className="truncate text-sm font-medium">Load Sample Project</span>
            </button>
            
            <div className="pt-4 mb-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</span>
                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <PlusCircle size={18} />
                </button>
              </div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`w-full flex items-center gap-1 rounded-lg transition-all group ${
                    currentProject?.id === project.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-secondary/50'
                  }`}
                >
                  <button
                    onClick={() => setCurrentProject(project)}
                    className={`flex-1 flex items-center gap-3 px-3 py-2 text-left ${
                      currentProject?.id === project.id ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <FolderOpen size={16} className="shrink-0" />
                    <span className="truncate text-sm font-medium">{project.name}</span>
                  </button>
                  {deletingId === project.id ? (
                    <div className="flex items-center gap-1 pr-2">
                      <button
                        onClick={async () => { await deleteProject(project.id); setDeletingId(null); }}
                        className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded hover:bg-red-500/20"
                      >Delete</button>
                      <button onClick={() => setDeletingId(null)} className="text-muted-foreground hover:text-foreground">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(project.id)}
                      className="opacity-0 group-hover:opacity-100 pr-2 text-muted-foreground hover:text-red-400 transition-all"
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Launchpad */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Launchpad</span>
              </div>
              <button 
                onClick={() => setIsAiLinksModalOpen(true)}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary transition-colors"
              >
                <Settings size={12} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/60 leading-tight mb-4 px-2 italic">
              Open your AI tool and paste the conversation into AI Logs.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {aiLinks.map(ai => (
                <a 
                  key={ai.id}
                  href={ai.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 text-[10px] font-medium transition-all group border border-transparent hover:border-primary/20"
                >
                  <span className="truncate">{ai.name}</span>
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
            {/* Insights / Blog Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Insights</span>
              </div>
            </div>
            <div className="space-y-2">
              {blogPosts.slice(0, 3).map(post => (
                <button
                  key={post.id}
                  onClick={() => {
                    setActiveTab('blog-post');
                    router.push(`/blog/${post.id}/`);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-secondary/20 hover:bg-secondary/50 transition-all border border-transparent hover:border-primary/10 group"
                >
                  <p className="text-[11px] font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{post.title}</p>
                  <p className="text-[9px] text-muted-foreground">{post.date}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Picker */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3 px-2">
              <Palette size={14} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interface Theme</span>
            </div>
            <div className="flex gap-2 px-2">
              {themes.map(t => (
                <button 
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  title={t.name}
                  className={`w-6 h-6 rounded-full ${t.color} border-2 transition-all ${theme === t.id ? 'border-white scale-125' : 'border-transparent opacity-50 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border space-y-1">
          <button onClick={() => setIsSearchOpen(true)} className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-2 text-sm">
            <div className="flex items-center gap-3">
              <Search size={16} />
              <span>Search</span>
            </div>
            <div className="flex items-center gap-1 opacity-50">
              <Command size={10} />
              <span className="text-[10px]">K</span>
            </div>
          </button>
          <button 
            onClick={() => {
              if (!isPro) {
                alert('Export Backup is a Pro feature. Please upgrade to save your data to a file.');
              } else {
                handleExport();
              }
            }} 
            className={`flex items-center gap-3 transition-colors w-full px-2 py-2 text-sm ${isPro ? 'text-muted-foreground hover:text-foreground' : 'text-primary/60 hover:text-primary'}`}
          >
            <Download size={16} />
            <span>Export Backup {!isPro && ' (Pro)'}</span>
          </button>
          <label className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-2 text-sm cursor-pointer">
            <Upload size={16} />
            <span>Import Backup</span>
            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>
          <button 
            onClick={() => setIsLicenseModalOpen(true)}
            className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-2 text-sm"
          >
            <Settings size={16} />
            <span>{isPro ? 'Pro Settings' : 'Upgrade to Pro'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-background">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 glass sticky top-0 z-10">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold truncate">
              {currentProject?.name || 'Select a Project'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center bg-secondary/50 rounded-full px-3 py-1 text-xs border border-border">
                <Clock size={14} className="mr-2 text-primary" />
                <span className="truncate">Last sync: Just now</span>
             </div>
             <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                <Search size={20} />
             </button>
          </div>
        </header>

        {!currentProject ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
             <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary animate-pulse">
                <FolderOpen size={48} />
             </div>
             <h3 className="text-2xl font-bold mb-2">Select or Create a Project</h3>
             <p className="text-muted-foreground max-w-sm mb-8">
                Choose a project from the sidebar to view its dashboard, logs, and files.
             </p>
             <button onClick={() => setIsProjectModalOpen(true)} className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                New Project
             </button>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 flex items-center gap-1 border-b border-border bg-background/50 sticky top-16 z-10 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              <div className="flex flex-col lg:flex-row gap-8 h-full">
                <div className="flex-1 min-w-0">
                  {activeTab === 'dashboard' && <Dashboard project={currentProject} logs={logs} files={files} tasks={tasks} knowledge={knowledge} isPro={isPro} />}
                  {activeTab === 'logs' && <ConversationLogs logs={logs} onAdd={() => setIsLogModalOpen(true)} />}
                  {activeTab === 'files' && <FileVault files={files} onAddFile={addFile} isPro={isPro} />}
                  {activeTab === 'tasks' && <TaskList tasks={tasks} onAddTask={addTask} onToggle={toggleTask} />}
                  {activeTab === 'knowledge' && <KnowledgeBase items={knowledge} onAdd={addKnowledge} />}
                  {activeTab === 'insights' && <BlogList />}
                  {activeTab === 'blog-post' && <BlogPost />}
                  {activeTab === 'guide' && (
                    <div className="space-y-8 animate-fade-in max-w-5xl pb-20">
                      <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                          <HelpCircle size={200} />
                        </div>
                        
                        <div className="relative z-10">
                          <h2 className="text-4xl font-black mb-8 uppercase tracking-tight">Master <span className="text-primary">DevFlow</span></h2>
                          
                          <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                               <div className="flex gap-6">
                                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black shrink-0 border border-primary/20">1</div>
                                  <div>
                                     <h4 className="font-bold text-xl mb-2">Sync AI Logs</h4>
                                     <p className="text-muted-foreground text-sm leading-relaxed">Paste AI fixes into "AI Logs". Use tags like #bugfix to maintain a searchable history of your project's evolution.</p>
                                  </div>
                               </div>
                               <div className="flex gap-6">
                                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black shrink-0 border border-primary/20">2</div>
                                  <div>
                                     <h4 className="font-bold text-xl mb-2">Compare Versions</h4>
                                     <p className="text-muted-foreground text-sm leading-relaxed">In "File Vault", use the <strong>Compare</strong> button to see a side-by-side diff between AI generations. Never lose a working version again.</p>
                                  </div>
                               </div>
                               <div className="flex gap-6">
                                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black shrink-0 border border-primary/20">3</div>
                                  <div>
                                     <h4 className="font-bold text-xl mb-2">Keyboard Power</h4>
                                     <p className="text-muted-foreground text-sm leading-relaxed">Press <kbd className="px-2 py-1 bg-secondary rounded text-[10px] border border-border">Ctrl+K</kbd> to search everything, or <kbd className="px-2 py-1 bg-secondary rounded text-[10px] border border-border">Ctrl+N</kbd> to quickly log a new AI conversation.</p>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-8">
                               <div className="flex gap-6">
                                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-black shrink-0 border border-accent/20">4</div>
                                  <div>
                                     <h4 className="font-bold text-xl mb-2">AI Next Actions</h4>
                                     <p className="text-muted-foreground text-sm leading-relaxed">Use the Task List to plan your next prompt. Clicking "Complete" triggers an お祝い celebration to keep you motivated!</p>
                                  </div>
                               </div>
                               <div className="flex gap-6">
                                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-black shrink-0 border border-accent/20">5</div>
                                  <div>
                                     <h4 className="font-bold text-xl mb-2">Prompt Templates</h4>
                                     <p className="text-muted-foreground text-sm leading-relaxed">Tag items in "Knowledge" with <span className="text-primary font-bold">#template</span> to create reusable AI instructions with one-click copy.</p>
                                  </div>
                               </div>
                               <div className="flex gap-6">
                                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-black shrink-0 border border-accent/20">6</div>
                                  <div>
                                     <h4 className="font-bold text-xl mb-2">Customize Launchpad</h4>
                                     <p className="text-muted-foreground text-sm leading-relaxed">Click the ⚙️ in the sidebar to add your favorite AI tools like ChatGPT, Claude, or local LLM interfaces.</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                         <div className="glass p-6 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-3 mb-4">
                               <Palette className="text-primary" size={20} />
                               <h4 className="font-bold">UI Themes</h4>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">Switch between Indigo, Midnight, Slate, and Forest themes in the sidebar to match your coding environment's aesthetic.</p>
                         </div>
                         <div className="glass p-6 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-3 mb-4">
                               <Download className="text-primary" size={20} />
                               <h4 className="font-bold">Privacy First</h4>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">All data stays in your browser's IndexedDB. Use "Export Backup" to keep your project safe across different machines.</p>
                         </div>
                         <div className="glass p-6 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-3 mb-4">
                               <Search className="text-primary" size={20} />
                               <h4 className="font-bold">Search History</h4>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">Can't remember how AI solved that CORS error? Just hit Ctrl+K and search for "CORS" to find the exact log instantly.</p>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <aside className="hidden xl:block w-80 shrink-0 space-y-6">
                  <div className="glass p-6 rounded-3xl border border-white/5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Project Progress</h3>
                     {(() => {
                       const computedProgress = tasks.length > 0
                         ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
                         : 0;
                       return (
                         <div className="relative w-48 h-48 mx-auto mb-6">
                           <svg className="w-full h-full transform -rotate-90">
                             <circle cx="96" cy="96" r="86" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-secondary" />
                             <circle cx="96" cy="96" r="86" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray={540} strokeDashoffset={540 - (540 * computedProgress) / 100} className="text-primary transition-all duration-700 ease-out" strokeLinecap="round" />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-4xl font-bold">{computedProgress}%</span>
                             <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Complete</span>
                             <span className="text-[8px] text-primary/60 font-bold mt-1">({tasks.filter(t => t.completed).length}/{tasks.length} tasks)</span>
                           </div>
                         </div>
                       );
                     })()}
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Files</span>
                        <span className="font-bold">{files.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">AI Logs</span>
                        <span className="font-bold">{logs.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tasks</span>
                        <span className="font-bold">{tasks.filter(t => t.completed).length} / {tasks.length}</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </>
        )}

        {currentProject && (
          <div className="fixed bottom-8 right-8 z-30 flex flex-col items-end gap-2 group">
             <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl pointer-events-none uppercase tracking-[0.2em] mb-1 whitespace-nowrap translate-y-2 group-hover:translate-y-0 duration-300">
                New AI Log
             </span>
             <button onClick={() => setIsLogModalOpen(true)} className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white shadow-2xl shadow-accent/40 hover:scale-110 active:scale-95 transition-all">
               <Plus size={28} className="transition-transform duration-300" />
             </button>
          </div>
        )}

        {/* PWA Install Banner */}
        {showInstallBanner && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-lg animate-slide-up">
            <div className="glass p-4 rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Rocket size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Install DevFlow</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight">Add to desktop for a better experience & offline access.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowInstallBanner(false)}
                  className="p-2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
                <button 
                  onClick={handleInstallClick}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {isProjectModalOpen && <ProjectModal onClose={() => setIsProjectModalOpen(false)} onSubmit={addProject} />}
      {isLogModalOpen && <LogModal onClose={() => setIsLogModalOpen(false)} onSubmit={addLog} isPro={isPro} />}
      {isAiLinksModalOpen && (
        <AILinksModal 
          isOpen={isAiLinksModalOpen} 
          onClose={() => setIsAiLinksModalOpen(false)} 
          links={aiLinks}
          onAdd={addAiLink}
          onDelete={deleteAiLink}
        />
      )}

      {/* License Modal */}
      {isLicenseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md glass rounded-3xl shadow-2xl overflow-hidden border border-white/10 animate-slide-up">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-bold">DevFlow Pro</h3>
              <button onClick={() => setIsLicenseModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {isPro ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto">
                    <Check size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Pro Version Active</p>
                    <p className="text-sm text-muted-foreground">Thank you for supporting DevFlow!</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-xl font-mono text-xs break-all">
                    Key: {licenseKey}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Pro Lifetime</span>
                        <span className="text-xl font-black">$8</span>
                    </div>
                    <ul className="text-[11px] space-y-2 text-muted-foreground">
                        <li className="flex items-center gap-2">✅ Unlimited Projects & AI Logs</li>
                        <li className="flex items-center gap-2">✅ Smart Parse (Conversation Format)</li>
                        <li className="flex items-center gap-2">✅ File Diff & Version Compare</li>
                        <li className="flex items-center gap-2">✅ Project Context Generator</li>
                        <li className="flex items-center gap-2">✅ Export Backup Support</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">License Key</label>
                        <input 
                        type="text" 
                        placeholder="DF-XXXX-XXXX-XXXX"
                        className="w-full font-mono"
                        value={licenseInput}
                        onChange={(e) => setLicenseInput(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => {
                        if (activatePro(licenseInput)) {
                            alert('Pro activated successfully! Welcome to the command center.');
                            setIsLicenseModalOpen(false);
                        } else {
                            alert('Invalid license key. Please try again.');
                        }
                        }}
                        className="w-full btn-primary py-3 font-black uppercase tracking-widest text-xs"
                    >
                        Activate Pro
                    </button>
                    <a 
                        href="https://yhanster206.gumroad.com/l/rhctvv" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-[10px] text-primary font-bold uppercase tracking-widest hover:underline"
                    >
                        Get Pro License on Gumroad →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
