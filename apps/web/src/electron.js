const { app, globalShortcut, BrowserWindow } = window.require('electron').remote

const SHORTCUTS = {
  // 'Option+Space': () => {
  //   const windows = BrowserWindow.getAllWindows()
  //   console.log('focus', windows)
  //   if (windows && windows.length) {
  //     windows[0].focus()
  //   }
  // },
}

globalShortcut.unregisterAll()

for (const shortcut of Object.keys(SHORTCUTS)) {
  const ret = globalShortcut.register(shortcut, SHORTCUTS[shortcut])
  if (!ret) {
    console.log('couldnt register shortcut')
  }
}
