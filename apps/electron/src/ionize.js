import React from 'react'
import Ionize from '@mcro/ionize'
import { app, globalShortcut, screen, ipcMain } from 'electron'

class Window {
  key = Math.random()
  get active() {
    return this.path !== '/'
  }

  constructor({ path = '/' } = {}) {
    this.path = path
  }
}

class Windows {
  windows = []

  next(path) {
    const next = this.windows[0]
    next.path = path
    this.windows = [new Window(), ...this.windows]
    return next
  }

  remove(path) {
    this.windows = this.windows.filter(window => window.path === path)
  }
}

const WindowsXP = new Windows()

class ExampleApp extends React.Component {
  state = {
    show: false,
    size: [0, 0],
    position: [0, 0],
    windows: WindowsXP.windows,
  }

  componentDidMount() {
    setTimeout(() => {
      this.next() // preload app window a second after initial load
    }, 1000)
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
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    console.log({ width, height })
    this.size = [Math.round(width / 2), Math.round(height / 1.5)]
    this.position = [
      Math.round(width / 2 - this.size[0] / 2),
      Math.round(height / 2 - this.size[1] / 2),
    ]
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
      WindowsXP.remove(path)
      this.updateWindows()
    })
  }

  updateWindows = () => {
    return new Promise(resolve => {
      this.setState({ windows: WindowsXP.windows }, resolve)
    })
  }

  next = async path => {
    const next = WindowsXP.next(path)
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

  render() {
    const { windows } = this.state
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

    console.log('render', this.state.size)

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
          defaultSize={this.state.size}
          size={this.state.size}
          ref={this.onWindow}
          showDevTools
          file="http://jot.dev/bar"
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
        {windows.map(({ key, active }) => {
          return (
            <window
              key={key}
              {...appWindow}
              showDevTools={false}
              titleBarStyle="hidden-inset"
              file={`http://jot.dev?key=${key}`}
              show={active}
              ref={ref => this.onAppWindow(key, ref)}
            />
          )
        })}
      </app>
    )
  }
}

// <window
//   showDevTools
//   file="http://jot.dev"
//   titleBarStyle="hidden-inset"
//   vibrancy="dark"
//   transparent
//   webPreferences={{
//     experimentalFeatures: true,
//     transparentVisuals: true,
//   }}
//   show
//   size={this.state.size}
//   position={this.state.position}
//   onReadyToShow={() => this.setState({ show: true })}
//   onResize={size => this.setState({ size })}
//   onMoved={position => this.setState({ position })}
// />

Ionize.start(<ExampleApp />)
