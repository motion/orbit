let x = require('electron')

x.app.on('ready', () => {

let w = new x.BrowserWindow({ width: 800, height: 600 })
let v = new x.BrowserView()

w.addBrowserView(v)
v.setBounds({ x: 20, y: 20, width: 300, height: 300 })

v.webContents.loadURL('https://electronjs.org')

let z = new x.BrowserView()
w.addBrowserView(z)
z.setBounds({ x: 320, y: 20, width: 300, height: 300 })

z.webContents.loadURL('https://electronjs.org')

//let a = new x.BrowserWindow({ width: 800, height: 800 })
//a.addBrowserView(z)

})
