import { app, globalShortcut } from 'electron'

const SHORTCUTS = {
  'Control+Space': () => {
    console.log('pressed that shiz')
  },
}

app.on('ready', () => {
  for (const shortcut of Object.keys(SHORTCUTS)) {
    const ret = globalShortcut.register(shortcut, SHORTCUTS[shortcut])
    if (!ret) {
      console.log('registration failed', shortcut)
    }
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
