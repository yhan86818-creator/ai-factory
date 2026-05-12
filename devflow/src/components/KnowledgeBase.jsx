import React, { useState } from 'react';
import { Search, Plus, Tag, Calendar, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const KnowledgeBase = ({ items, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Knowledge & Templates</h2>
          <p className="text-xs text-muted-foreground mt-1">Reusable prompts, configurations, and mental models.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search knowledge..." 
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-secondary/50 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col group relative overflow-hidden">
            {item.tags?.includes('template') && (
              <div className="absolute top-0 right-0 p-3">
                <Sparkles size={16} className="text-primary opacity-40" />
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${item.tags?.includes('template') ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                {item.tags?.includes('template') ? <Sparkles size={20} /> : <BookOpen size={20} />}
              </div>
              <h3 className="font-bold text-lg truncate pr-8">{item.title}</h3>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl text-sm leading-relaxed mb-6 flex-1 min-h-[100px] relative">
               <p className="whitespace-pre-wrap">{item.content}</p>
               <button 
                onClick={() => copyToClipboard(item.content, item.id)}
                className="absolute bottom-2 right-2 p-2 bg-background/80 backdrop-blur border border-white/10 rounded-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                title="Copy to clipboard"
               >
                {copiedId === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-muted-foreground" />}
               </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-auto">
              {item.tags?.map((tag, i) => (
                <span key={i} className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${tag === 'template' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-secondary text-muted-foreground'}`}>
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
              <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
                <Calendar size={10} />
                {format(new Date(item.createdAt), 'MMM dd')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-border">
          <div className="mb-4 text-muted-foreground opacity-20 flex justify-center">
              <Search size={64} />
          </div>
          <p className="text-muted-foreground">No knowledge items found.</p>
        </div>
      )}

      {/* Add Knowledge Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl glass rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-white/10 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                    <h3 className="text-xl font-bold flex items-center gap-2"><BookOpen size={20} className="text-primary" /> Add Knowledge</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                        <Plus size={20} className="rotate-45" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Title</label>
                        <input 
                            id="newKnowledgeTitle"
                            type="text" 
                            placeholder="e.g. Vite React TypeScript Setup"
                            className="w-full rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Tags (comma separated)</label>
                        <input 
                            id="newKnowledgeTags"
                            type="text" 
                            placeholder="e.g. vite, template, setup"
                            className="w-full rounded-xl"
                        />
                        <p className="text-[10px] text-muted-foreground ml-1">Tip: Add "template" to highlight this as a reusable prompt.</p>
                    </div>
                    <div className="space-y-2 flex-1 flex flex-col min-h-[250px]">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Content / Prompt</label>
                        <textarea 
                            id="newKnowledgeContent"
                            placeholder="Paste your knowledge, code, or prompt template here..."
                            className="w-full flex-1 font-mono text-sm p-4 bg-[#0d1117] resize-none rounded-2xl border border-white/10 focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
                <div className="p-6 border-t border-border flex gap-3 shrink-0">
                    <button onClick={() => setIsAddModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                    <button 
                        onClick={() => {
                            const title = document.getElementById('newKnowledgeTitle').value;
                            const tagsInput = document.getElementById('newKnowledgeTags').value;
                            const content = document.getElementById('newKnowledgeContent').value;
                            if (title && content) {
                                const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
                                onAdd({ title, tags, content });
                                setIsAddModalOpen(false);
                            }
                        }}
                        className="btn-primary flex-1"
                    >
                        Save Knowledge
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
