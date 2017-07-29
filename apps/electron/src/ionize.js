import React from 'react'
import Ionize from '@mcro/ionize'
import { app, globalShortcut, BrowserWindow, ipcMain } from 'electron'

console.log('app', app)

class ExampleApp extends React.Component {
  state = {
    show: false,
    size: [650, 500],
    position: [450, 300],
    disableAutohide: false,
    // preloads
    windows: ['/', '/', '/'],
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
    ipcMain.on('goto', (event, url) => {
      console.log('goto', url)
      event.sender.send('asynchronous-reply', 'cool')
      this.setState({
        windows: [url, ...this.state.windows],
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

  const appWindow = {
    show: true,
    size: [500, 500],
    showDevTools: true,
    titleBarStyle: "hidden-inset",
    vibrancy: "dark",
    transparent: true,
    webPreferences: {
      experimentalFeatures: true,
      transparentVisuals: true,
    }
  }

  onPreloaded = index = (...args) => {
    console.log('onpreloaded', ...args)
  }

  render() {
    const { windows } = this.state

      const preloadWindow = index =>
        windows[index] === '/' && <window key={index} file="http://jot.dev" ref={this.onPreloaded(index)} />

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
          file="http://jot.dev/bar2"
          titleBarStyle="hidden"
          show={this.state.show}
          size={this.state.size}
          position={this.state.position}
          onReadyToShow={() => this.onReadyToShow()}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
        />
        {windows.map((path, index) => {
          const url = `http://jot.dev${path}`
          return (
            <window
              key={index}
              {...appWindow}
              file={url}
              show={path !== '/'}
            />
          )
        })}
        {preloadWindow(window.length)}
        {preloadWindow(window.length + 1)}
        {preloadWindow(window.length + 2)}
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
