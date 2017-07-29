import React from 'react'
import Ionize from '@mcro/ionize'
import { app, globalShortcut, BrowserWindow, ipcMain } from 'electron'

console.log('app', app)

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
  windows = [new Window()] // preloaded windows

  next(path) {
    this.windows[0].path = path
    this.windows = [new Window(), ...this.windows]
    console.log('next this.windows', this.windows, path)
    return this.windows
  }

  remove(path) {
    this.windows = this.windows.filter(window => window.path === path)
    return this.windows
  }
}

const WindowsXP = new Windows()

class ExampleApp extends React.Component {
  state = {
    show: false,
    size: [650, 500],
    position: [450, 300],
    disableAutohide: false,
    // preloads
    windows: WindowsXP.windows,
  }

  onReadyToShow = () => {
    // hacky for now
    this.setState({ show: true })
    console.log('this.state', this.state)
    console.log('allwindows', BrowserWindow.getAllWindows())
    this.windowRef = BrowserWindow.getAllWindows()[0]
    this.listenForBlur()
    this.registerShortcuts()
    this.listenToApp()
  }

  onWindowRef = (key, ref) => {
    console.log('got a window ref', key, ref)
    const win = this.state.windows.find(x => x.key === key)
    console.log('found win', win)
    if (win) {
      win.ref = ref
    }
  }

  listenToApp = () => {
    ipcMain.on('bar-goto', (event, path) => {
      this.goTo(path)
    })

    ipcMain.on('bar-hide', () => {
      this.close()
    })

    ipcMain.on('close', (event, path) => {
      this.setState({
        windows: WindowsXP.remove(path),
      })
    })
  }

  goTo = path => {
    this.setState({
      windows: WindowsXP.next(path),
    })
  }

  close = () => {
    this.setState({
      show: false,
    })
  }

  listenForBlur() {
    this.windowRef.on('blur', () => {
      if (!this.state.disableAutohide) {
        this.close()
      }
    })
  }

  registerShortcuts() {
    const SHORTCUTS = {
      'Option+Space': () => {
        console.log('focusme')
        this.windowRef.focus()
        this.setState({
          show: true,
        })
      },
    }

    globalShortcut.unregisterAll()

    for (const shortcut of Object.keys(SHORTCUTS)) {
      console.log('regsitering shortut', shortcut, typeof SHORTCUTS[shortcut])
      const ret = globalShortcut.register(shortcut, SHORTCUTS[shortcut])
      if (!ret) {
        console.log('couldnt register shortcut')
      } else {
        console.log('registered')
      }
    }
  }

  onPreloaded = index => (...args) => {
    console.log('onpreloaded', index, ...args)
  }

  render() {
    const { windows } = this.state

    const appWindow = {
      defaultSize: [500, 500],
      titleBarStyle: 'hidden-inset',
      vibrancy: 'dark',
      transparent: true,
      webPreferences: {
        experimentalFeatures: true,
        transparentVisuals: true,
      },
    }

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
          show
          showDevTools
          file="http://jot.dev/bar3"
          titleBarStyle="hidden"
          show={this.state.show}
          size={this.state.size}
          position={this.state.position}
          onReadyToShow={this.onReadyToShow}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
        />
        {windows.map(({ key, active }) => {
          return (
            <window
              key={key}
              {...appWindow}
              file={'http://jot.dev'}
              show={active}
              ref={ref => this.onWindowRef(key, ref)}
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
