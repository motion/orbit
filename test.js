const BrowserWindow = require('electron').BrowserWindow

setTimeout(() => {
  y = new BrowserWindow({
    width: 500,
    height: 500,
    hasShadow: true,
    frame: false,
    vibrancy: 'light',
    transparent: true,
    // background: '#00000000',
    titleBarStyle: 'hiddenInset',
  })

  y.loadURL('http://localhost:4000')

  setTimeout(() => {
    y.loadURL('http://localhost:4000?')
  }, 1000)
}, 100)
