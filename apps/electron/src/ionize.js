import React from 'react'
import Ionize from '@mcro/ionize'
import { app, globalShortcut, BrowserWindow } from 'electron'

console.log('app', app)

class ExampleApp extends React.Component {
  state = {
    show: false,
    size: [650, 500],
    position: [450, 300],
  }

  onReadyToShow() {
    // hacky for now
    this.setState({ show: true }, () => {
      console.log('this.state', this.state)
      console.log('allwindows', BrowserWindow.getAllWindows())
      this.windowRef = BrowserWindow.getAllWindows()[0]
      this.listenForBlur()
      this.registerShortcuts()
    })
  }

  listenForBlur() {
    this.windowRef.on('blur', () => {
      this.setState({
        show: false,
      })
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

  render() {
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
          showDevTools
          file="http://jot.dev/bar2"
          titleBarStyle="hidden-inset"
          vibrancy="light"
          transparent
          webPreferences={{
            experimentalFeatures: true,
            transparentVisuals: true,
          }}
          show={this.state.show}
          size={this.state.size}
          position={this.state.position}
          onReadyToShow={() => this.onReadyToShow()}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
        />
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
