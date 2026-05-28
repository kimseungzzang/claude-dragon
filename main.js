const { app, BrowserWindow, screen } = require('electron')
const http = require('http')
const path = require('path')

let win

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({
    width: 300,
    height: 260,
    x: width - 310,
    y: height - 270,
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

function startServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    if (req.url === '/notify') {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        let cwd = ''
        try {
          const data = JSON.parse(body)
          cwd = path.basename(data.cwd || '')
        } catch (_) {}
        win?.webContents.send('dragon-appear', cwd)
        res.writeHead(200)
        res.end('ok')
      })
    } else {
      res.writeHead(404)
      res.end()
    }
  })
  server.listen(3939, '127.0.0.1')
}

app.whenReady().then(() => {
  createWindow()
  startServer()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
