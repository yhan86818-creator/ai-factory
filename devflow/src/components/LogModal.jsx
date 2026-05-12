import React, { useState } from 'react';
import { X, Sparkles, BrainCircuit } from 'lucide-react';

const LogModal = ({ onClose, onSubmit, isPro }) => {
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    answer: '',
    result: 'solved', // solved, unsolved, new_issue
    tags: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    onSubmit({
      title: formData.title,
      prompt: formData.question,
      result: formData.answer,
      status: formData.result,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl glass rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-white/10 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" size={20} />
            <h3 className="text-xl font-bold">Log AI Conversation</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Title</label>
            <input 
              type="text" 
              placeholder="e.g. Fixed the sidebar bug"
              className="w-full"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">My Question</label>
              <textarea 
                placeholder="What did you ask AI?"
                className="w-full h-32 resize-none"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-muted-foreground">AI Answer Summary</label>
                <button 
                  type="button"
                  onClick={() => {
                    if (!isPro) {
                        alert('Smart Parse is a Pro feature. Upgrade to automatically format pasted AI conversations.');
                        return;
                    }
                    const content = formData.answer;
                    if (!content) return;
                    
                    let parsed = content;
                    
                    // Detect ChatGPT pattern
                    if (content.includes('User\n') || content.includes('ChatGPT\n')) {
                        parsed = content
                            .replace(/User\n/g, '### 👤 User\n')
                            .replace(/ChatGPT\n/g, '\n### 🤖 AI (ChatGPT)\n');
                    }
                    // Detect Claude pattern
                    else if (content.includes('Claude\n') || content.includes('Assistant\n')) {
                        parsed = content
                            .replace(/Claude\n/g, '\n### 🤖 AI (Claude)\n')
                            .replace(/Assistant\n/g, '\n### 🤖 AI (Claude)\n');
                    }
                    
                    setFormData({ ...formData, answer: parsed });
                    alert('Smart Parse completed! Detected AI conversation structure and applied formatting.');
                  }}
                  className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${isPro ? 'text-primary hover:underline' : 'text-muted-foreground opacity-50'}`}
                >
                  <BrainCircuit size={12} />
                  Smart Parse {!isPro && '(Pro)'}
                </button>
              </div>
              <textarea 
                placeholder="Key takeaways from AI... (Or paste raw conversation and click Smart Parse)"
                className="w-full h-32 resize-none"
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Outcome</label>
              <select 
                className="w-full"
                value={formData.result}
                onChange={(e) => setFormData({...formData, result: e.target.value})}
              >
                <option value="solved">✅ Solved</option>
                <option value="unsolved">❌ Unsolved</option>
                <option value="new_issue">⚠️ New Problem Found</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. bug, ui, react"
                className="w-full"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 shrink-0">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogModal;
