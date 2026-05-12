import React, { useState } from 'react';
import { Plus, CheckSquare, Square, Trash2, BrainCircuit, Target, ArrowRight, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const TaskList = ({ tasks, onAddTask, onToggle }) => {
  const [newTask, setNewTask] = useState('');
  const [taskType, setTaskType] = useState('todo'); // todo, ai_ask
  const [copiedId, setCopiedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    onAddTask({ text: newTask, type: taskType });
    setNewTask('');
  };

  const handleToggle = (task) => {
    if (!task.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#f43f5e', '#ffffff']
      });
    }
    onToggle(task);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const todoTasks = tasks.filter(t => t.type === 'todo');
  const aiTasks = tasks.filter(t => t.type === 'ai_ask');

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Tasks & Next Actions</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* ToDo List */}
        <div className="glass p-5 md:p-8 rounded-3xl border border-white/5 flex flex-col min-h-[400px] md:min-h-[500px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <CheckSquare size={24} />
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-bold">Standard ToDos</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Build & Refine</p>
            </div>
          </div>

          <form onSubmit={(e) => { setTaskType('todo'); handleSubmit(e); }} className="mb-6 relative">
            <input 
              type="text" 
              placeholder="Add a new task..." 
              className="w-full pl-4 pr-12 py-3 bg-secondary/50 border-border text-sm rounded-xl"
              value={taskType === 'todo' ? newTask : ''}
              onChange={(e) => { setTaskType('todo'); setNewTask(e.target.value); }}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:scale-110 transition-transform">
              <Plus size={18} />
            </button>
          </form>

          <div className="flex-1 space-y-3">
            {todoTasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all border group ${
                  task.completed 
                    ? 'bg-secondary/20 border-transparent opacity-60' 
                    : 'bg-secondary/40 border-white/5 hover:border-primary/30 hover:bg-secondary/60 shadow-sm'
                }`}
                onClick={() => handleToggle(task)}
              >
                <div className="mt-0.5 shrink-0">
                  {task.completed ? (
                    <CheckSquare className="text-primary" size={18} />
                  ) : (
                    <Square className="text-muted-foreground" size={18} />
                  )}
                </div>
                <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                  {task.text}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(task.text, task.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all text-muted-foreground hover:text-foreground"
                >
                  {copiedId === task.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI "Ask Next" List */}
        <div className="glass p-5 md:p-8 rounded-3xl border border-white/5 flex flex-col min-h-[400px] md:min-h-[500px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BrainCircuit size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    <BrainCircuit size={24} />
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold">Next for AI</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Questions & Prompts</p>
                </div>
            </div>

            <form onSubmit={(e) => { setTaskType('ai_ask'); handleSubmit(e); }} className="mb-6 relative">
                <input 
                    type="text" 
                    placeholder="What will you ask AI next?" 
                    className="w-full pl-4 pr-12 py-3 bg-accent/5 border-accent/20 focus:ring-accent/30 text-sm rounded-xl"
                    value={taskType === 'ai_ask' ? newTask : ''}
                    onChange={(e) => { setTaskType('ai_ask'); setNewTask(e.target.value); }}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-lg hover:scale-110 transition-transform">
                    <ArrowRight size={18} />
                </button>
            </form>

            <div className="flex-1 space-y-3">
                {aiTasks.map((task) => (
                    <div 
                        key={task.id} 
                        className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all border group ${
                            task.completed 
                                ? 'bg-secondary/20 border-transparent opacity-40' 
                                : 'bg-accent/5 border-accent/10 hover:border-accent/40 hover:bg-accent/10'
                        }`}
                        onClick={() => handleToggle(task)}
                    >
                        <div className={`mt-2 w-2 h-2 rounded-full shrink-0 ${task.completed ? 'bg-muted-foreground' : 'bg-accent animate-pulse'}`} />
                        <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
                            {task.text}
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(task.text, task.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all text-muted-foreground hover:text-foreground"
                        >
                          {copiedId === task.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
