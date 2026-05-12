import React, { useState } from 'react';
import { X, Plus, Trash2, Globe } from 'lucide-react';

const AILinksModal = ({ isOpen, onClose, links, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !url) return;
    
    // Ensure URL has protocol
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }
    
    onAdd({ name, url: formattedUrl });
    setName('');
    setUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Manage AI Shortcuts</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                <input 
                  type="text" 
                  placeholder="ChatGPT"
                  className="w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">URL</label>
                <input 
                  type="text" 
                  placeholder="chat.openai.com"
                  className="w-full"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-2.5 flex items-center justify-center gap-2">
              <Plus size={18} />
              Add Shortcut
            </button>
          </form>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Shortcuts</label>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Globe size={14} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{link.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{link.url}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(link.id)}
                    className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-center py-8 text-xs text-muted-foreground italic">No shortcuts added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILinksModal;
