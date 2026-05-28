const { app, BrowserWindow, screen } = require('electron')
const fs = require('fs')
const path = require('path')

const TRIGGER_FILE = '/tmp/claude-dragon-trigger'

let win

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({
    width: 300,
    height: 260,
    x: Math.floor((width - 300) / 2),
    y: Math.floor((height - 260) / 2),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'))
  win.setIgnoreMouseEvents(true, { forward: true })
}

function watchTrigger() {
  let lastContent = ''

  const tryRead = () => {
    try {
      const content = fs.readFileSync(TRIGGER_FILE, 'utf8').trim()
      if (!content || content === lastContent) return
      lastContent = content
      const data = JSON.parse(content)
      const cwd = path.basename(data.cwd || '')
      const contextPct = data.context_pct ?? null
      win?.webContents.send('dragon-appear', cwd, contextPct)
    } catch (_) {}
  }

  fs.watch(path.dirname(TRIGGER_FILE), (eventType, filename) => {
    if (filename === path.basename(TRIGGER_FILE)) tryRead()
  })
}

app.whenReady().then(() => {
  createWindow()
  watchTrigger()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
