import React from 'react'
import Ionize from '@mcro/ionize'
import { app, globalShortcut, BrowserWindow, ipcMain } from 'electron'

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

    console.log('go to', path, this.windows[0].ref)

    this.windows = [new Window(), ...this.windows]
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

  onWindow = ref => {
    if (ref) {
      this.windowRef = ref
    }
  }

  onReadyToShow = () => {
    this.setState({ show: true })
    this.listenToApp()
    this.listenForBlur()
    this.registerShortcuts()
  }

  onAppWindow = (key, ref) => {
    const win = this.state.windows.find(x => x.key === key)
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
      show: false,
      windows: WindowsXP.next(path),
    })
  }

  close = () => {
    this.setState({
      show: false,
    })
  }

  listenForBlur = () => {
    this.windowRef.on('blur', () => {
      console.log('got a blur')
      if (!this.state.disableAutohide) {
        this.close()
      }
    })
  }

  registerShortcuts = () => {
    console.log('registerShortcuts')
    globalShortcut.unregisterAll()
    const SHORTCUTS = {
      'Option+Space': () => {
        console.log('command option+space')
        this.windowRef.focus()
        this.setState({
          show: true,
        })
      },
    }
    for (const shortcut of Object.keys(SHORTCUTS)) {
      const ret = globalShortcut.register(shortcut, SHORTCUTS[shortcut])
      if (!ret) {
        console.log('couldnt register shortcut')
      }
    }
  }

  render() {
    const { windows } = this.state
    const appWindow = {
      defaultSize: [700, 500],
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
          defaultSize={[600, 500]}
          ref={this.onWindow}
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
