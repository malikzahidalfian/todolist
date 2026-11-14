const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('todoAPI', {
  loadTodos: () => ipcRenderer.invoke('todos:load'),
  saveTodos: (todos) => ipcRenderer.invoke('todos:save', todos),
  loadCategories: () => ipcRenderer.invoke('categories:load'),
  saveCategories: (categories) => ipcRenderer.invoke('categories:save', categories),
  loadGoals: () => ipcRenderer.invoke('goals:load'),
  saveGoals: (goalsData) => ipcRenderer.invoke('goals:save', goalsData),
  loadHistory: () => ipcRenderer.invoke('history:load'),
  saveHistory: (historyData) => ipcRenderer.invoke('history:save', historyData),
  loadAgendas: () => ipcRenderer.invoke('agendas:load'),
  saveAgendas: (agendas) => ipcRenderer.invoke('agendas:save', agendas),
  openDataFolder: () => ipcRenderer.invoke('todos:open-data-folder'),
  getVersion: () => ipcRenderer.invoke('app:get-version'),
  getServerInfo: () => ipcRenderer.invoke('server:get-info')
});
