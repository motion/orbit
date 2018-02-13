import { TRAY_WIDTH, TRAY_HEIGHT } from '~/constants'

const baseUrl = window.location.host

export default ({ app, BrowserWindow, ipcMain, Tray }) => {
  let tray = undefined
  let window = undefined

  const createTray = () => {
    tray = new Tray('icon.png')
    tray.on('click', function(event) {
      toggleWindow()
    })
  }

  const getWindowPosition = () => {
    const windowBounds = window.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    )

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 3)

    return { x, y }
  }

  // Creates window & specifies its values
  const createWindow = () => {
    window = new BrowserWindow({
      width: TRAY_WIDTH,
      height: TRAY_HEIGHT,
      show: false,
      frame: false,
      fullscreenable: false,
      resizable: false,
      transparent: true,
      'node-integration': false,
    })
    // This is where the index.html file is loaded into the window
    window.loadURL(`http://${baseUrl}/?inTray`)

    // Hide the window when it loses focus
    window.on('blur', () => {
      if (!window.webContents.isDevToolsOpened()) {
        window.hide()
      }
    })
  }

  const toggleWindow = () => {
    if (window.isVisible()) {
      window.hide()
    } else {
      showWindow()
    }
  }

  const showWindow = () => {
    const position = getWindowPosition()
    window.setPosition(position.x, position.y, false)
    window.show()
    window.focus()
  }

  ipcMain.on('show-window', () => {
    showWindow()
  })

  // Don't show the app in the doc
  // app.dock.hide()

  // Creates tray & window
  // app.on('ready', () => {
  createTray()
  createWindow()
  // })

  // Quit the app when the window is closed
  app.on('window-all-closed', () => {
    app.quit()
  })
}
