X=require('electron')

setTimeout(() => {
new X.BrowserWindow({
  width: 500,
height: 500,
hasShadow: true,
file: 'https://google.com',
//frameless: true,
vibrancy: 'light',
transparent: true,
background: "#00000000",
titleBarStyle:"hiddenInset"
})
}, 100)
