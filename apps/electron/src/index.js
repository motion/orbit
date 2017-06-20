'use strict'

const electron = require('electron')
const app = electron.app
const GHReleases = require('electron-gh-releases')

const updater = new GHReleases({
  repo: 'motion/macro-app',
  currentVersion: app.getVersion(),
})

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// disable aggressive caching
app.commandLine.appendSwitch('--disable-http-cache')

// prevent window being garbage collected
let mainWindow

function onClosed() {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null
}

/** Updater */

function checkUpdate(focusedWindow) {
  updater.check((err, status) => {
    if (!err && status) {
      updater.download()
      return
    }
    electron.dialog.showMessageBox(focusedWindow, {
      type: 'info',
      buttons: ['ok'],
      title: 'Congratulations',
      message: "You're all up to date!",
    })
  })
}

updater.on('update-downloaded', info => {
  electron.dialog('Installing update. This should only take a moment.')

  updater.install()
})

/** Create new menu */
function createMenu() {
  const name = app.getName()

  const template = [
    {
      label: name,
      submenu: [
        {
          role: 'about',
        },
        {
          label: 'Restart and install update',
          click(item, focusedWindow) {
            checkUpdate(focusedWindow)
          },
        },
        {
          type: 'separator',
        },
        {
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          role: 'hide',
        },
        {
          role: 'hideothers',
        },
        {
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          role: 'quit',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo',
        },
        {
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
        },
        {
          role: 'copy',
        },
        {
          role: 'paste',
        },
        {
          role: 'delete',
        },
        {
          role: 'selectall',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin'
            ? 'Alt+Command+I'
            : 'Ctrl+Shift+I',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          },
        },
        {
          role: 'togglefullscreen',
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close',
        },
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize',
        },
        {
          label: 'Zoom',
          role: 'zoom',
        },
        {
          type: 'separator',
        },
        {
          label: 'Bring All to Front',
          role: 'front',
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
        },
      ],
    },
  ]

  const menu = electron.Menu.buildFromTemplate(template)
  electron.Menu.setApplicationMenu(menu)
}

function createMainWindow() {
  const win = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: 'hidden-inset',
    minWidth: 780,
    minHeight: 600,
    backgroundColor: '#1F1F1F',
    show: false,
  })

  win.loadURL(`file://${__dirname}/index.html`)
  win.on('closed', onClosed)

  win.on('ready-to-show', () => {
    checkUpdate()
    createMenu()
    if (win.getURL().includes('usemacro.com')) {
      win.show()
    }
  })

  return win
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', () => {
  mainWindow = createMainWindow()
})
