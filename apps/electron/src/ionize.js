import React from 'react'
import Ionize from '@mcro/ionize'
import { app, globalShortcut, BrowserWindow, ipcMain } from 'electron'

console.log('app', app)

class Window {
  key = Math.random()
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

  onReadyToShow() {
    // hacky for now
    this.setState({ show: true }, () => {
      console.log('this.state', this.state)
      console.log('allwindows', BrowserWindow.getAllWindows())
      this.windowRef = BrowserWindow.getAllWindows()[0]
      this.listenForBlur()
      this.registerShortcuts()
      this.listenToApp()
    })
  }

  listenToApp() {
    ipcMain.on('goto', (event, path) => {
      console.log('goto', path)
      event.sender.send('asynchronous-reply', 'cool')
      this.setState({
        windows: WindowsXP.next(path),
      })
    })

    ipcMain.on('close', (event, path) => {
      this.setState({
        windows: WindowsXP.remove(path),
      })
    })
  }

  listenForBlur() {
    this.windowRef.on('blur', () => {
      if (!this.state.disableAutohide) {
        this.setState({
          show: false,
        })
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
      Escape: () => {
        console.log('escape')
        this.setState({
          show: false,
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
      size: [500, 500],
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
          onReadyToShow={() => this.onReadyToShow()}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
        />
        {windows.map(({ path, key }) => {
          const url = `http://jot.dev${path}`
          console.log(path, key)
          return (
            <window key={key} {...appWindow} file={url} show={path !== '/'} />
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
