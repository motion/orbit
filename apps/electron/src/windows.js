import React from 'react'
import { app, globalShortcut, screen, ipcMain } from 'electron'
import Window from './window'
import repl from 'repl'
import localShortcut from 'electron-localshortcut'
import osap from 'osap'

const MIN_WIDTH = 750
const MIN_HEIGHT = 600
const JOT_URL = 'http://jot.dev'
const IS_MAC = process.platform === 'darwin'

const measure = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const size = [
    Math.max(MIN_WIDTH, Math.round(width / 1.8)),
    Math.max(MIN_HEIGHT, Math.round(height / 1.5)),
  ]
  const middleX = Math.round(width / 2 - size[0] / 2)
  const middleY = Math.round(height / 2 - size[1] / 2)
  // const endX = width - size[0] - 20
  // const endY = height - size[1] - 20

  return {
    size,
    position: [middleX, middleY],
  }
}

let onWindows = []
export function onWindow(cb) {
  onWindows.push(cb)
}

const JOT_HOME = '/'

class WindowStore {
  constructor(opts = {}) {
    this.path = opts.path || JOT_HOME
    this.key = opts.key || Math.random()
    this.position = opts.position || measure().position
    this.size = opts.size || measure().size
    this.showBar = true
  }
  get active() {
    return this.path !== JOT_HOME
  }
  setPosition = x => (this.position = x)
  setSize = x => (this.size = x)
  toggleBar() {
    console.log('toggling bar')
    this.showBar = !this.showBar
  }
  hasPathCbs = []
  onHasPath(cb) {
    this.hasPathCbs.push(cb)
  }
  setPath(value) {
    this.path = value
    if (value !== '/') {
      for (const listener of this.hasPathCbs) {
        listener()
      }
      this.hasPathCbs = []
    }
  }
}

class WindowsStoreFactory {
  windows = []
  addWindow = () => {
    this.windows = [new WindowStore({ size: [450, 700] }), ...this.windows]
  }
  next(path) {
    if (!this.windows[0]) {
      this.addWindow()
      return
    }
    this.addWindow()
    const toShowWindow = this.windows[1]

    console.log('> next path is', toShowWindow.path)
    if (toShowWindow) {
      if (path) {
        toShowWindow.setPath(path)
      }
    }

    console.log('next path:', path, toShowWindow.key)
    return toShowWindow
  }
  findBy(key) {
    return this.windows.find(x => `${x.key}` === `${key}`)
  }
  removeBy(key, val) {
    this.windows = this.windows.filter(window => window[key] === val)
  }
  removeByPath(path) {
    this.removeBy('path', path)
  }
  removeByKey(key) {
    this.removeBy('key', key)
  }
}

const WindowsStore = new WindowsStoreFactory()

export default class ExampleApp extends React.Component {
  state = {
    restart: false,
    show: true,
    size: [0, 0],
    position: [0, 0],
    windows: WindowsStore.windows,
  }

  componentDidMount() {
    this.measureAndShow()
    this.next() // preload one app window
    onWindows.forEach(cb => {
      cb(this)
    })

    setTimeout(() => {
      this.measureAndShow()
    }, 500)

    this.repl = repl.start({
      prompt: 'electron > ',
    })

    Object.assign(this.repl.context, {
      Root: this,
      WindowsStore: WindowsStore,
    })

    console.log('started a repl!')
  }

  hide = () =>
    new Promise(resolve =>
      this.setState({ show: false }, () => {
        resolve()
      })
    )

  show = () =>
    new Promise(resolve =>
      this.setState(
        { show: true, position: this.position, size: this.size },
        resolve
      )
    )

  measure = () => {
    const { position, size } = measure()
    this.size = size
    this.position = position
    this.initialSize = this.initialSize || this.size
  }

  onWindow = ref => {
    if (ref) {
      this.windowRef = ref
      this.measure()
      this.show()
      this.listenToApps()
      this.registerShortcuts()
    }
  }

  onAppWindow = win => electron => {
    if (win && electron && !win.ref) {
      win.ref = electron

      // dev-tools helpers, from electron-debug
      const toggleDevTools = () => {
        win.showDevTools = !win.showDevTools
        this.updateWindows()
      }

      localShortcut.register(
        IS_MAC ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
        toggleDevTools
      )
      localShortcut.register('F12', toggleDevTools)
      localShortcut.register('CmdOrCtrl+R', () => {
        electron.webContents.reloadIgnoringCache()
      })
    }
  }

  listenToApps = () => {
    ipcMain.on('where-to', (event, key) => {
      const win = WindowsStore.findBy(key)
      if (win) {
        win.onHasPath(() => {
          console.log('where-to:', key, win.path)
          event.sender.send('app-goto', win.path)
        })
      } else {
        console.log('no window found for where-to event')
      }
    })

    ipcMain.on('bar-goto', (event, path) => {
      this.openApp(path)
    })

    ipcMain.on('bar-hide', () => {
      this.hide()
    })

    ipcMain.on('close', (event, path) => {
      console.log('got close message')
      WindowsStore.removeByPath(path)
      this.updateWindows()
    })

    ipcMain.on('app-bar-toggle', (event, key) => {
      console.log('got a toggle from', key)
      WindowsStore.findBy(key).toggleBar()
      this.updateWindows()
      event.sender.send('app-bar-toggle', 'success')
    })
  }

  updateWindows = () => {
    return new Promise(resolve => {
      this.setState({ windows: WindowsStore.windows }, resolve)
    })
  }

  next = path => {
    const next = WindowsStore.next(path)
    this.updateWindows()
    return next
  }

  openApp = path => {
    this.hide()
    const next = this.next(path)

    if (!next) {
      console.log('no next')
      return
    }

    setTimeout(() => {
      if (next.ref) {
        next.ref.focus()
      }
    }, 100)
  }

  registerShortcuts = () => {
    console.log('registerShortcuts')
    globalShortcut.unregisterAll()

    const SHORTCUTS = {
      'Option+Space': () => {
        console.log('command option+space')
        if (this.state.show) {
          this.hide()
        } else {
          this.measureAndShow()
        }
      },
    }
    for (const shortcut of Object.keys(SHORTCUTS)) {
      const ret = globalShortcut.register(shortcut, SHORTCUTS[shortcut])
      if (!ret) {
        console.log('couldnt register shortcut')
      }
    }
  }

  measureAndShow = async () => {
    console.log('measuring and showing')
    this.measure()
    await this.show()
    this.windowRef.focus()
  }

  onReadyToShow = () => {
    console.log('READY TO SHOW')
  }

  unstable_handleError(error) {
    console.error(error)
    this.setState({ error })
  }

  uid = Math.random()

  render() {
    const { windows, error, restart } = this.state

    if (restart) {
      console.log('\n\n\n\n\n\nRESTARTING\n\n\n\n\n\n')
      this.repl.close()
      onWindows = []
      return (
        <app>
          <window />
        </app>
      )
    }

    const appWindow = {
      frame: false,
      defaultSize: [700, 500],
      vibrancy: 'dark',
      transparent: true,
      hasShadow: true,
      webPreferences: {
        experimentalFeatures: true,
        transparentVisuals: true,
      },
    }

    if (error) {
      console.log('recover render')
      return null
    }

    return (
      <app>
        <menu>
          <submenu label="Electron">
            <about />
            <sep />
            <hide />
            <hideothers />
            <unhide />
            <sep />
            <quit />
          </submenu>
          <submenu label="Edit">
            <undo />
            <redo />
            <sep />
            <cut />
            <copy />
            <paste />
            <selectall />
          </submenu>
          <submenu label="Custom Menu">
            <item label="Foo the bars" />
            <item label="Baz the quuxes" />
            <sep />
            <togglefullscreen />
          </submenu>
        </menu>
        <window
          key={this.uid}
          {...appWindow}
          defaultSize={this.initialSize || this.state.size}
          size={this.state.size}
          ref={this.onWindow}
          showDevTools
          file={`${JOT_URL}/bar?cachebust=${this.uid}`}
          titleBarStyle="customButtonsOnHover"
          show={this.state.show}
          size={this.state.size}
          position={this.state.position}
          onReadyToShow={this.onReadyToShow}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
          onFocus={() => {
            this.activeWindow = this.windowRef
          }}
        />
        {windows.map(win => {
          return (
            <Window
              key={win.key}
              ref={this.onAppWindow(win)}
              file={`${JOT_URL}?key=${win.key}`}
              show={win.active}
              {...appWindow}
              defaultSize={win.size}
              size={win.size}
              position={win.position}
              onMoved={x => {
                win.setPosition(x)
                this.updateWindows()
              }}
              onResize={x => {
                win.setSize(x)
                this.updateWindows()
              }}
              onClose={() => {
                console.log('closing!', win.key)
                WindowsStore.removeByKey(win.key)
                this.updateWindows()
              }}
              onFocus={() => {
                console.log('focused!', win.key)
                //win.showDevTools = true
                win.focused = true
                this.activeWindow = win.ref
                this.updateWindows()
              }}
              onBlur={() => {
                if (!win) {
                  console.log('no window weird')
                  return
                }
                console.log('blurred!', win.key)
                win.focused = false
                if (this.activeWindow.key === win.key) {
                  this.activeWindow = null
                }
                this.updateWindows()
              }}
              showDevTools={win.showDevTools}
              titleBarStyle={
                win.showBar ? 'hidden-inset' : 'customButtonsOnHover'
              }
            />
          )
        })}
      </app>
    )
  }
}
