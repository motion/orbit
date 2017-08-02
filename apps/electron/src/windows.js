import React from 'react'
import { app, globalShortcut, screen, ipcMain } from 'electron'
import { once } from 'lodash'

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

const JOT_HOME = 'http://jot.dev'
class Window extends React.Component {
  state = {
    showing: false,
    position: 0,
  }

  componentDidUpdate() {
    if (this.props.show) {
      console.log('show this window')
      if (!this.state.showing) {
        this.setState({ showing: true })
      }
    }

    if (this.state.showing) {
      this.startAnimate()
    }
  }

  startAnimate = once(() => {
    console.log('startanimate')
    this.interval = setInterval(() => {
      console.log('setstate')
      // this.setState({ position: this.state.position + 10 })
      clearInterval(this.interval)
    }, 1000)
  })

  getPublicInstance() {
    return {}
  }

  render() {
    const { position, ...props } = this.props

    return (
      <window
        {...props}
        position={[position[0], position[1] + this.state.position]}
      />
    )
  }
}

class WindowStore {
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

class WindowsStore {
  windows = []
  addWindow = () => {
    this.windows = [new WindowStore(), ...this.windows]
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

const WinStore = new WindowsStore()

export default class ExampleApp extends React.Component {
  state = {
    restart: false,
    show: true,
    size: [0, 0],
    position: [0, 0],
    windows: WinStore.windows,
  }

  componentDidMount() {
    this.measureAndShow()

    setTimeout(() => {
      this.next() // preload app window a second after initial load
    }, 1000)

    onWindows.forEach(cb => {
      cb(this)
    })
  }

  hide = () => new Promise(resolve => this.setState({ show: false }, resolve))

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

  onAppWindow = (key, ref) => {
    const win = this.state.windows.find(x => x.key === key)
    if (win) {
      win.ref = ref
    }
  }

  listenToApps = () => {
    ipcMain.on('where-to', (event, key) => {
      const win = this.state.windows.find(x => `${x.key}` === `${key}`)
      if (win) {
        console.log('where to?', win.path)
        event.sender.send('app-goto', win.path)
      } else {
        console.log('no window found for where-to event')
      }
    })

    ipcMain.on('bar-goto', (event, path) => {
      this.goTo(path)
    })

    ipcMain.on('bar-hide', () => {
      this.hide()
    })

    ipcMain.on('close', (event, path) => {
      WinStore.removeByPath(path)
      this.updateWindows()
    })
  }

  updateWindows = () => {
    return new Promise(resolve => {
      this.setState({ windows: WinStore.windows }, resolve)
    })
  }

  next = async path => {
    const next = WinStore.next(path)
    await this.updateWindows()
    return next
  }

  goTo = async path => {
    this.hide()
    const next = await this.next(path)
    console.log('got next.ref', next.ref)
    // next.ref.focus()
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

  randomKey = Math.random()

  render() {
    const { windows, error, restart } = this.state

    if (restart) {
      console.log('restarting2')
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

    // console.log('render', this.state, windows, WinStore)

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
        {windows.map(win => {
          return (
            <Window
              key={win.key}
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
                WinStore.removeByKey(win.key)
                this.updateWindows()
              }}
              onFocus={() => {
                console.log('focused!', win.key)
                win.showDevTools = true
                win.focused = true
                this.updateWindows()
              }}
              onBlur={() => {
                console.log('blurred!', win.key)
                win.focused = false
                this.updateWindows()
              }}
              showDevTools={win.showDevTools}
              titleBarStyle="hidden-inset"
              file={`http://jot.dev?key=${win.key}`}
              show={win.active}
              ref={ref => this.onAppWindow(win.key, ref)}
            />
          )
        })}
      </app>
    )
  }
}
