const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dragonAPI', {
  onAppear: (cb) => ipcRenderer.on('dragon-appear', (_event, cwd, contextPct) => cb(cwd, contextPct))
})
