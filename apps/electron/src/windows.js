import React from 'react'
import { app, globalShortcut, screen, ipcMain } from 'electron'

const MIN_WIDTH = 50
const MIN_HEIGHT = 500

const measure = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const size = [
    Math.max(MIN_WIDTH, Math.round(width / 3)),
    Math.max(MIN_HEIGHT, Math.round(height / 2)),
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

const JOT_HOME = `http://jot.dev`
class Window {
  path = JOT_HOME
  key = Math.random()
  position = measure().position
  size = measure().size
  get active() {
    return this.path !== JOT_HOME
  }
  setPosition = x => (this.position = x)
  setSize = x => (this.size = x)
}

class Windows {
  windows = []
  addWindow = () => {
    this.windows = [new Window(), ...this.windows]
  }
  next(path) {
    console.log('next path:', path)
    if (!this.windows[0]) {
      this.addWindow()
      return
    }
    this.addWindow()
    const next = this.windows[1]

    console.log('currentn next path is', next.path)
    if (next) {
      if (path) {
        next.path = path
      }
      return next
    }
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

const WindowStore = new Windows()

export default class ExampleApp extends React.Component {
  state = {
    restart: false,
    show: true,
    size: [0, 0],
    position: [0, 0],
    windows: WindowStore.windows,
  }

  componentDidMount() {
    setTimeout(() => {
      this.next() // preload app window a second after initial load
    }, 1000)

    onWindows.forEach(cb => {
      cb(this)
    })
  }

  hide = () => {
    this.setState({ show: false })
  }

  show = () => {
    this.setState({ show: true, position: this.position, size: this.size })
  }

  blur = () => {
    if (!this.disableAutohide) {
      this.hide()
    }
  }

  measure = () => {
    const { position, size } = measure()
    this.size = size
    this.position = position
    this.initialSize = this.initialSize || this.size
  }

  get disableAutohide() {
    return false
  }

  set disableAutohide(value) {
    // todo
  }

  onWindow = ref => {
    if (ref) {
      this.windowRef = ref
      this.measure()
      this.show()
      this.listenToApp()
      this.listenForBlur()
      this.registerShortcuts()
    }
  }

  onAppWindow = (key, ref) => {
    const win = this.state.windows.find(x => x.key === key)
    if (win) {
      win.ref = ref
    }
  }

  listenToApp = () => {
    ipcMain.on('where-to', (event, key) => {
      console.log('find', key, this.state.windows)
      const win = this.state.windows.find(x => `${x.key}` === `${key}`)
      if (win) {
        console.log('where to?', win.path)
        event.sender.send('app-goto', win.path)
      }
    })

    ipcMain.on('bar-goto', (event, path) => {
      this.goTo(path)
    })

    ipcMain.on('bar-hide', () => {
      this.hide()
    })

    ipcMain.on('close', (event, path) => {
      WindowStore.removeByPath(path)
      this.updateWindows()
    })
  }

  updateWindows = () => {
    return new Promise(resolve => {
      console.log(
        'windows are',
        WindowStore.windows.map((w, i) => `index: ${i}, path: ${w.path}`)
      )
      this.setState({ windows: WindowStore.windows }, resolve)
    })
  }

  next = async path => {
    const next = WindowStore.next(path)
    await this.updateWindows()
    return next
  }

  goTo = async path => {
    this.hide()
    const next = await this.next(path)
    next.ref.focus()
  }

  listenForBlur = () => {
    this.windowRef.on('blur', () => {
      console.log('got a blur')
      // this.blur()
    })
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
          this.measure()
          this.show()
          this.windowRef.focus()
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

  onReadyToShow = () => {
    console.log('READY TO SHOW')
  }

  unstable_handleError(error) {
    console.error(error)
    this.setState({ error })
  }

  randomKey = Math.random()

  render() {
    const { windows, error, restart } = this.state

    if (restart) {
      console.log('restarting')
      return null
    }

    const appWindow = {
      frame: false,
      defaultSize: [700, 500],
      vibrancy: 'dark',
      transparent: true,
      webPreferences: {
        experimentalFeatures: true,
        transparentVisuals: true,
      },
    }

    if (error) {
      console.log('recover render')
      return null
    }

    // console.log('render', this.state, windows, WindowStore)

    return (
      <app>
        <menu>
          <submenu label="Electron">
            <about />
            <sep />
            <quit />
          </submenu>
          <submenu label="Custom Menu">
            <item label="Foo the bars" />
            <sep />
            <item label="Baz the quuxes" />
          </submenu>
        </menu>
        <window
          key={-100}
          {...appWindow}
          defaultSize={this.initialSize || this.state.size}
          size={this.state.size}
          ref={this.onWindow}
          showDevTools
          file={`${JOT_HOME}/bar?randomId=${this.randomKey}`}
          titleBarStyle="customButtonsOnHover"
          show={this.state.show}
          size={this.state.size}
          position={
            this.state.show
              ? this.state.position
              : this.state.size.map(x => -x - 100)
          }
          onReadyToShow={this.onReadyToShow}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
        />
        {windows.map(
          ({ key, active, path, position, size, setPosition, setSize }) => {
            console.log('rendering path', path, 'active', active)
            return (
              <window
                key={key}
                {...appWindow}
                defaultSize={size}
                size={size}
                position={position}
                onMoved={x => {
                  setPosition(x)
                  this.updateWindows()
                }}
                onResize={x => {
                  setSize(x)
                  this.updateWindows()
                }}
                onClose={() => {
                  WindowStore.removeByKey(key)
                  this.updateWindows()
                }}
                showDevTools={false}
                titleBarStyle="hidden-inset"
                file={path}
                show={active}
                ref={ref => this.onAppWindow(key, ref)}
              />
            )
          }
        )}
      </app>
    )
  }
}
