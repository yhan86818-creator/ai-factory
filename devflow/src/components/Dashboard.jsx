import React from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  FileCode, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Target,
  Lightbulb
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = ({ project, logs, files, tasks, knowledge, isPro }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const stats = [
    { label: 'Conversations', value: logs.length, icon: MessageSquare, color: 'text-blue-500' },
    { label: 'Files Generated', value: files.length, icon: FileCode, color: 'text-purple-500' },
    { label: 'Tasks Done', value: completedTasks, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Knowledge Base', value: knowledge.length, icon: Lightbulb, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20">
      {/* Contact & Feedback Banner */}
      <div className="glass p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <MessageSquare size={18} />
          </div>
          <div className="text-sm">
            <span className="font-bold">Have a suggestion?</span>
            <p className="text-muted-foreground text-xs">Help us make DevFlow better for everyone.</p>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 py-2 px-4 rounded-xl text-xs font-mono text-primary select-all">
          yhan86818@gmail.com
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Stats</span>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Progress */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp size={120} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Current Progress</h3>
            <p className="text-muted-foreground mb-8 max-w-md">
              {project.description || "Track your development journey and see how far you've come."}
            </p>
            
            <div className="flex flex-col xl:flex-row items-center gap-8 md:gap-12">
              <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-secondary lg:hidden"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-secondary hidden lg:block"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={352}
                    strokeDashoffset={352 - (352 * progress) / 100}
                    className="text-primary transition-all duration-1000 ease-out lg:hidden"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * progress) / 100}
                    className="text-primary transition-all duration-1000 ease-out hidden lg:block"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold">{progress}%</span>
                  <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-muted-foreground">Complete</span>
                  <span className="text-[7px] md:text-[8px] text-primary/60 font-bold mt-1">({completedTasks}/{tasks.length} tasks)</span>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={18} className="text-accent" />
                    <h4 className="font-semibold">Main Goal</h4>
                  </div>
                  <p className="text-sm bg-white/5 p-4 rounded-xl border border-white/5 italic text-foreground">
                    {project.goal ? `"${project.goal}"` : <span className="text-muted-foreground">No goal set — edit the project to add one.</span>}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => {
                        if (!isPro) {
                            alert('Copy AI Context is a Pro feature. Upgrade to quickly brief your AI.');
                            return;
                        }
                        const context = `
PROJECT CONTEXT for AI:
Name: ${project.name}
Description: ${project.description || 'N/A'}
Main Goal: ${project.goal || 'N/A'}

CURRENT PROGRESS: ${progress}%
Completed Tasks: ${tasks.filter(t => t.completed).length}/${tasks.length}
Remaining Tasks: ${tasks.filter(t => !t.completed).map(t => '- ' + t.text).join('\n')}

RECENT ACTIVITY:
${logs.slice(0, 5).map(l => `- [${l.status}] ${l.title}`).join('\n')}

KNOWLEDGE BASE:
${knowledge.map(k => `- ${k.title} (${k.tags.join(', ')})`).join('\n')}
                        `.trim();
                        navigator.clipboard.writeText(context);
                        alert('Project context copied for AI! Paste it into ChatGPT/Claude to start a focused session.');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shrink-0 border ${
                        isPro 
                        ? 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20' 
                        : 'bg-white/5 text-muted-foreground border-white/10 opacity-60'
                    }`}
                  >
                    <MessageSquare size={14} />
                    Copy AI Context {!isPro && '(Pro)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-6">
            {logs.slice(0, 5).map((log, i) => (
              <div key={i} className="flex gap-4 relative group">
                {i !== logs.slice(0, 5).length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-border group-hover:bg-primary/30 transition-colors" />
                )}
                <div className={`mt-1 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10 ${
                  log.status === 'success' ? 'bg-green-500/20 text-green-500' : 
                  log.status === 'in-progress' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{log.title}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(log.timestamp), 'MMM d, HH:mm')}</p>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground italic text-sm">
                No activity yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
