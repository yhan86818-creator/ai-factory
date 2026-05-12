import React, { useState } from 'react';
import { Search, Plus, Calendar, Tag, ChevronDown, ChevronUp, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';

const ConversationLogs = ({ logs, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLog, setExpandedLog] = useState(null);

  const filteredLogs = logs.filter(log => 
    log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.prompt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="text-green-500" size={18} />;
      case 'in-progress': return <AlertCircle className="text-amber-500" size={18} />;
      default: return <HelpCircle className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">AI Conversation Logs</h2>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 w-full sm:w-48 lg:w-64 bg-secondary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={onAdd} className="btn-primary p-2 sm:px-4 sm:py-2 flex items-center gap-2 whitespace-nowrap">
            <Plus size={18} />
            <span className="hidden xs:inline">Add Log</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div 
            key={log.id} 
            className={`glass rounded-2xl overflow-hidden border transition-all ${
              expandedLog === log.id ? 'border-primary/40 ring-1 ring-primary/20' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div 
              className="p-4 md:p-5 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="hidden xs:flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary/50 text-muted-foreground shrink-0">
                   <span className="text-[8px] md:text-[10px] font-bold uppercase">{format(new Date(log.timestamp), 'MMM')}</span>
                   <span className="text-sm md:text-lg font-bold text-foreground leading-tight">{format(new Date(log.timestamp), 'dd')}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base md:text-lg leading-tight mb-1 truncate">{log.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">
                      <Calendar size={12} />
                      {format(new Date(log.timestamp), 'HH:mm')}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-secondary border border-border whitespace-nowrap">
                      {getStatusIcon(log.status)}
                      <span className="capitalize">{(log.status || 'unknown').replace('_', ' ')}</span>
                    </span>
                    {log.tags?.map((tag, i) => (
                      <span key={i} className="hidden sm:flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground shrink-0 ml-2">
                {expandedLog === log.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {expandedLog === log.id && (
              <div className="px-4 md:px-5 pb-6 animate-fade-in border-t border-border mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <HelpCircle size={14} />
                      Prompt / Question
                    </h4>
                    <div className="bg-white/5 p-4 rounded-xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap border border-white/5 italic">
                      "{log.prompt || 'No prompt recorded.'}"
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <CheckCircle size={14} />
                      AI Result / Solution
                    </h4>
                    <div className="bg-primary/5 p-4 rounded-xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap border border-primary/10">
                      {log.result || 'No result recorded.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-border">
            <div className="mb-4 text-muted-foreground opacity-20 flex justify-center">
                <Search size={64} />
            </div>
            <p className="text-muted-foreground">No logs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationLogs;
