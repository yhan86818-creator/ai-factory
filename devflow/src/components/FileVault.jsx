import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileCode, 
  Folder, 
  Download, 
  Plus, 
  Eye, 
  Trash2, 
  ChevronRight, 
  Search, 
  ChevronDown,
  History,
  Copy,
  Check,
  X,
  Split,
  ChevronLeft
} from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import JSZip from 'jszip';

const FileVault = ({ files, onAddFile, onDeleteFile, isPro }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFile, setViewingFile] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareWith, setCompareWith] = useState(null);
  const [newFilePath, setNewFilePath] = useState('');
  const [newFileContent, setNewFileContent] = useState('');

  // Group versions of the same file path
  const filesByPath = useMemo(() => {
    const groups = {};
    files.forEach(file => {
      if (!groups[file.path]) groups[file.path] = [];
      groups[file.path].push(file);
    });
    // Sort versions by timestamp descending
    Object.keys(groups).forEach(path => {
      groups[path].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
    return groups;
  }, [files]);

  const latestFiles = useMemo(() => {
    return Object.values(filesByPath).map(group => group[0]);
  }, [filesByPath]);

  const downloadAll = async () => {
    const zip = new JSZip();
    latestFiles.forEach(file => {
      zip.file(file.path, file.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project_files.zip';
    link.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = latestFiles.filter(f => f.path.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold">File Vault</h2>
            <p className="text-sm text-muted-foreground">Version control for AI-generated code.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={downloadAll} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span className="hidden xs:inline">Download ZIP</span>
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>New File</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-[600px]">
        {/* File List */}
        <div className="lg:col-span-1 glass rounded-3xl p-4 overflow-y-auto border border-white/5 flex flex-col">
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                    type="text" 
                    placeholder="Search files..." 
                    className="pl-9 pr-4 py-2 w-full text-sm rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="space-y-2 flex-1">
                {filteredFiles.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground text-sm italic">
                        No files stored yet.
                    </div>
                ) : (
                    filteredFiles.map(file => (
                        <button
                            key={file.id}
                            onClick={() => { setViewingFile(file); setIsCompareMode(false); }}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-2xl transition-all group border ${
                                viewingFile?.path === file.path ? 'bg-primary/10 border-primary/20 text-primary' : 'hover:bg-secondary/50 border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <FileCode size={18} className={viewingFile?.path === file.path ? 'text-primary' : 'text-muted-foreground'} />
                                <div className="text-left min-w-0">
                                    <p className="text-sm font-bold truncate">{file.path}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{filesByPath[file.path].length} versions • latest v{file.version}</p>
                                </div>
                            </div>
                            <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))
                )}
            </div>
        </div>

        {/* Code Preview & Diff */}
        <div className="lg:col-span-2 glass rounded-3xl flex flex-col overflow-hidden border border-white/5 relative">
            {viewingFile ? (
                <>
                    <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
                        <div className="flex items-center gap-4 min-w-0">
                            <button 
                                onClick={() => setViewingFile(null)}
                                className="lg:hidden p-2 hover:bg-secondary rounded-lg"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold truncate">{viewingFile.path}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-primary font-bold uppercase">Version {viewingFile.version}</span>
                                    <span className="text-[10px] text-muted-foreground">• {new Date(viewingFile.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => {
                                    if (!isPro) {
                                        alert('Version Comparison (Diff) is a Pro feature. Upgrade to compare changes.');
                                        return;
                                    }
                                    setIsCompareMode(!isCompareMode);
                                    if (!isCompareMode) setCompareWith(filesByPath[viewingFile.path][1] || null);
                                }}
                                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${
                                    isCompareMode 
                                    ? 'bg-primary text-white' 
                                    : isPro 
                                        ? 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                                        : 'text-muted-foreground opacity-50'
                                }`}
                            >
                                <Split size={14} />
                                <span className="hidden sm:inline">{isCompareMode ? 'Exit Diff' : isPro ? 'Compare' : 'Compare (Pro)'}</span>
                            </button>
                            <button 
                                onClick={() => copyToClipboard(viewingFile.content)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs font-bold"
                            >
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Comparison Sidebar (Versions) */}
                        <div className="w-48 border-r border-border bg-black/20 overflow-y-auto hidden md:block">
                            <div className="p-3 border-b border-border flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <History size={12} />
                                History
                            </div>
                            {filesByPath[viewingFile.path].map(v => (
                                <button 
                                    key={v.id}
                                    onClick={() => isCompareMode ? setCompareWith(v) : setViewingFile(v)}
                                    className={`w-full text-left px-4 py-3 border-b border-white/5 transition-all ${
                                        (isCompareMode ? compareWith?.id === v.id : viewingFile.id === v.id)
                                            ? 'bg-primary/10 text-primary' 
                                            : 'hover:bg-white/5 text-muted-foreground'
                                    }`}
                                >
                                    <p className="text-xs font-bold">Version {v.version}</p>
                                    <p className="text-[10px] opacity-60">{new Date(v.timestamp).toLocaleDateString()}</p>
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-auto flex bg-[#0d1117]">
                            {isCompareMode && compareWith && (
                                <div className="flex-1 border-r border-white/10 overflow-auto">
                                    <div className="sticky top-0 z-10 bg-secondary/80 backdrop-blur px-4 py-1 text-[10px] font-bold uppercase text-muted-foreground border-b border-white/5">
                                        v{compareWith.version} (Older)
                                    </div>
                                    <pre className="p-6 font-mono text-sm leading-relaxed">
                                        <code 
                                            className={`language-${viewingFile.path.split('.').pop() || 'javascript'}`}
                                            dangerouslySetInnerHTML={{ 
                                                __html: hljs.highlightAuto(compareWith.content).value 
                                            }}
                                        />
                                    </pre>
                                </div>
                            )}
                            <div className="flex-1 overflow-auto relative">
                                {isCompareMode && (
                                    <div className="sticky top-0 z-10 bg-primary/20 backdrop-blur px-4 py-1 text-[10px] font-bold uppercase text-primary border-b border-primary/20">
                                        v{viewingFile.version} (Selected)
                                    </div>
                                )}
                                <pre className="p-6 font-mono text-sm leading-relaxed">
                                    <code 
                                        className={`language-${viewingFile.path.split('.').pop() || 'javascript'}`}
                                        dangerouslySetInnerHTML={{ 
                                            __html: hljs.highlightAuto(viewingFile.content).value 
                                        }}
                                    />
                                </pre>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                    <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6 text-muted-foreground/30">
                        <FileCode size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Select a File</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                        Choose a file to view code, browse version history, and compare changes across AI generations.
                    </p>
                </div>
            )}
        </div>
      </div>

      {/* Add File Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-3xl glass rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-white/10 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                    <h3 className="text-xl font-bold">Store New File</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">File Path</label>
                        <input 
                            id="newFilePath"
                            type="text" 
                            placeholder="e.g. src/components/Button.jsx"
                            className="w-full rounded-xl"
                            value={newFilePath}
                            onChange={(e) => setNewFilePath(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 flex-1 flex flex-col min-h-[400px]">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Code Content</label>
                        <textarea 
                            id="newFileContent"
                            placeholder="Paste your code here..."
                            className="w-full flex-1 font-mono text-sm p-4 bg-[#0d1117] resize-none rounded-2xl border border-white/10 focus:ring-2 focus:ring-primary/50"
                            value={newFileContent}
                            onChange={(e) => setNewFileContent(e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-6 border-t border-border flex gap-3 shrink-0">
                    <button onClick={() => setIsAddModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                    <button 
                        onClick={() => {
                            if (newFilePath && newFileContent) {
                                onAddFile({ path: newFilePath, content: newFileContent });
                                setNewFilePath('');
                                setNewFileContent('');
                                setIsAddModalOpen(false);
                            }
                        }}
                        className="btn-primary flex-1"
                    >
                        Save to Vault
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FileVault;
