let e = require('electron')

e.app.on('ready', () => {
new e.BrowserWindow({
  show: true,
  file: 'http://localhost:3001',
  size: [400, 400],
  position: [0, 0],
  transparent: true,
  vibrancy: 'light',
  background: '#ffffff00'
})
})
