import { openDB } from 'idb';

const DB_NAME = 'devflow_db';
const DB_VERSION = 2;

let dbPromise = null;

export const initDB = async () => {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // Projects store
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }
      
      // Logs store
      if (!db.objectStoreNames.contains('logs')) {
        const store = db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
        store.createIndex('projectId', 'projectId');
      }
      
      // Files store
      if (!db.objectStoreNames.contains('files')) {
        const store = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
        store.createIndex('projectId', 'projectId');
        store.createIndex('path', 'path');
      }
      
      // Tasks store
      if (!db.objectStoreNames.contains('tasks')) {
        const store = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        store.createIndex('projectId', 'projectId');
      }
      
      // Knowledge store
      if (!db.objectStoreNames.contains('knowledge')) {
        const store = db.createObjectStore('knowledge', { keyPath: 'id', autoIncrement: true });
        store.createIndex('projectId', 'projectId');
      }

      // AI Links store (Settings)
      if (!db.objectStoreNames.contains('ai_links')) {
        db.createObjectStore('ai_links', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  }
  return dbPromise;
};

export const dbOps = {
  // Generic CRUD
  async getAll(storeName) {
    const db = await initDB();
    if (!db) return [];
    return db.getAll(storeName);
  },
  
  async getByProjectId(storeName, projectId) {
    const db = await initDB();
    if (!db) return [];
    return db.getAllFromIndex(storeName, 'projectId', projectId);
  },
  
  async add(storeName, item) {
    const db = await initDB();
    if (!db) return null;
    return db.add(storeName, item);
  },
  
  async update(storeName, item) {
    const db = await initDB();
    if (!db) return null;
    return db.put(storeName, item);
  },
  
  async delete(storeName, id) {
    const db = await initDB();
    if (!db) return null;
    return db.delete(storeName, id);
  },

  async clearProjectData(projectId) {
    const db = await initDB();
    if (!db) return;
    const tx = db.transaction(['logs', 'files', 'tasks', 'knowledge'], 'readwrite');
    
    for (const storeName of ['logs', 'files', 'tasks', 'knowledge']) {
      const store = tx.objectStore(storeName);
      const index = store.index('projectId');
      const keys = await index.getAllKeys(projectId);
      for (const key of keys) {
        store.delete(key);
      }
    }
    await tx.done;
  }
};
