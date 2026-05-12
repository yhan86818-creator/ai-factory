import { useState, useEffect, useCallback, useRef } from 'react';
import { dbOps } from '../lib/db';

export const useDevFlow = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [logs, setLogs] = useState([]);
  const [files, setFiles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [aiLinks, setAiLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const isInitializing = useRef(false);

  // Load projects and AI links on mount
  useEffect(() => {
    setIsPro(localStorage.getItem('devflow_pro_active') === 'true');
    setLicenseKey(localStorage.getItem('devflow_license_key') || '');

    if (isInitializing.current) return;
    isInitializing.current = true;

    const loadInitialData = async () => {
      const [pData, aData] = await Promise.all([
        dbOps.getAll('projects'),
        dbOps.getAll('ai_links')
      ]);
      
      setProjects(pData);
      
      // Auto-deduplicate and add defaults
      const defaults = [
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'Claude', url: 'https://claude.ai' },
        { name: 'Gemini', url: 'https://gemini.google.com' },
        { name: 'Perplexity', url: 'https://perplexity.ai' }
      ];

      if (aData.length === 0) {
        const addedLinks = [];
        for (const d of defaults) {
          const id = await dbOps.add('ai_links', d);
          addedLinks.push({ ...d, id });
        }
        setAiLinks(addedLinks);
      } else {
        // Simple deduplication check based on name + url
        const unique = [];
        const seen = new Set();
        const duplicates = [];
        
        for (const link of aData) {
          const key = `${link.name}-${link.url}`;
          if (seen.has(key)) {
            duplicates.push(link.id);
          } else {
            seen.add(key);
            unique.push(link);
          }
        }
        
        // Clean up duplicates from DB
        for (const id of duplicates) {
          await dbOps.delete('ai_links', id);
        }
        
        setAiLinks(unique);
      }

      if (pData.length > 0) {
        const lastProjectId = localStorage.getItem('lastProjectId');
        const project = pData.find(p => p.id === lastProjectId) || pData[0];
        setCurrentProject(project);
      }
      setLoading(false);
    };
    loadInitialData();
  }, []);

  // Load project-specific data when current project changes
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('lastProjectId', currentProject.id);
      loadProjectData(currentProject.id);
    }
  }, [currentProject]);

  const loadProjectData = async (projectId) => {
    const [l, f, t, k] = await Promise.all([
      dbOps.getByProjectId('logs', projectId),
      dbOps.getByProjectId('files', projectId),
      dbOps.getByProjectId('tasks', projectId),
      dbOps.getByProjectId('knowledge', projectId)
    ]);
    setLogs(l.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    setFiles(f);
    setTasks(t);
    setKnowledge(k);
  };

  const activatePro = (key) => {
    // 簡易的な検証ロジック（実際はAPI等で検証）
    if (key.length > 5) {
      setIsPro(true);
      setLicenseKey(key);
      localStorage.setItem('devflow_pro_active', 'true');
      localStorage.setItem('devflow_license_key', key);
      return true;
    }
    return false;
  };

  const checkLimit = (type) => {
    if (isPro) return { allowed: true };
    if (type === 'projects' && projects.length >= 5) {
      return { allowed: false, message: 'Free plan is limited to 5 projects.' };
    }
    if (type === 'logs' && logs.length >= 30) {
      return { allowed: false, message: 'Free plan is limited to 30 AI logs.' };
    }
    return { allowed: true };
  };

  const addProject = async (project) => {
    const limit = checkLimit('projects');
    if (!limit.allowed) {
      alert(limit.message + ' Please upgrade to Pro.');
      return;
    }
    const newProject = { 
      id: crypto.randomUUID(), 
      createdAt: new Date().toISOString(),
      status: 'In Progress',
      progress: 0,
      ...project 
    };
    await dbOps.add('projects', newProject);
    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
  };

  const updateProject = async (project) => {
    await dbOps.update('projects', project);
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    if (currentProject?.id === project.id) setCurrentProject(project);
  };

  const deleteProject = async (projectId) => {
    await dbOps.delete('projects', projectId);
    await dbOps.clearProjectData(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) setCurrentProject(projects[0] || null);
    setLoading(false);
  };

  const addLog = async (log) => {
    const limit = checkLimit('logs');
    if (!limit.allowed) {
      alert(limit.message + ' Please upgrade to Pro.');
      return;
    }
    const newLog = { ...log, projectId: currentProject.id, timestamp: new Date().toISOString() };
    const id = await dbOps.add('logs', newLog);
    setLogs(prev => [{ ...newLog, id }, ...prev]);
  };

  const addFile = async (file) => {
    const newFile = { ...file, projectId: currentProject.id, timestamp: new Date().toISOString(), version: 1 };
    const existing = files.find(f => f.path === file.path);
    if (existing) {
        newFile.version = (existing.version || 1) + 1;
    }
    const id = await dbOps.add('files', newFile);
    setFiles(prev => [...prev.filter(f => f.path !== file.path), { ...newFile, id }]);
  };

  const addTask = async (task) => {
    const newTask = { ...task, projectId: currentProject.id, completed: false, createdAt: new Date().toISOString() };
    const id = await dbOps.add('tasks', newTask);
    setTasks(prev => [...prev, { ...newTask, id }]);
  };

  const toggleTask = async (task) => {
    const updated = { ...task, completed: !task.completed };
    await dbOps.update('tasks', updated);
    setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
  };

  const addKnowledge = async (item) => {
    const newItem = { ...item, projectId: currentProject.id, createdAt: new Date().toISOString() };
    const id = await dbOps.add('knowledge', newItem);
    setKnowledge(prev => [...prev, { ...newItem, id }]);
  };

  const addAiLink = async (link) => {
    const id = await dbOps.add('ai_links', link);
    setAiLinks(prev => [...prev, { ...link, id }]);
  };

  const deleteAiLink = async (id) => {
    await dbOps.delete('ai_links', id);
    setAiLinks(prev => prev.filter(l => l.id !== id));
  };

  return {
    projects,
    currentProject,
    setCurrentProject,
    logs,
    files,
    tasks,
    knowledge,
    aiLinks,
    loading,
    isPro,
    licenseKey,
    activatePro,
    addProject,
    updateProject,
    deleteProject,
    addLog,
    addFile,
    addTask,
    toggleTask,
    addKnowledge,
    addAiLink,
    deleteAiLink,
    refreshData: (pid) => loadProjectData(pid || currentProject?.id)
  };
};
