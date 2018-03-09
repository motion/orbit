// In the main process.
const { app, BrowserWindow } = require('electron')

// Or use `remote` from the renderer process.
// const {BrowserWindow} = require('electron').remote

const load = () => {
  let win = new BrowserWindow({ width: 800, height: 600 })
  win.on('closed', () => {
    win = null
  })
  // Load a remote URL
  win.loadURL('http://localhost:3002/orbit')
}

app.on('ready', load)
