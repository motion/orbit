import React from 'react'
import Ionize from '@mcro/ionize'
import { globalShortcut, BrowserWindow } from 'electron'

class ExampleApp extends React.Component {
  state = {
    show: false,
    size: [650, 500],
    position: [450, 300],
  }

  componentDidMount() {
    this.registerShortcuts()
  }

  registerShortcuts() {
    const SHORTCUTS = {
      'Option+Space': () => {
        const windows = BrowserWindow.getAllWindows()
        console.log('focus', windows)
        if (windows && windows.length) {
          windows[0].focus()
        }
      },
    }

    globalShortcut.unregisterAll()

    for (const shortcut of Object.keys(SHORTCUTS)) {
      const ret = globalShortcut.register(shortcut, SHORTCUTS[shortcut])
      if (!ret) {
        console.log('couldnt register shortcut')
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
          file="http://jot.dev"
          titleBarStyle="hidden-inset"
          vibrancy="dark"
          transparent
          webPreferences={{
            experimentalFeatures: true,
            transparentVisuals: true,
          }}
          show={this.state.show}
          size={this.state.size}
          position={this.state.position}
          onReadyToShow={() => this.setState({ show: true })}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
        />
        <window
          showDevTools
          file="http://jot.dev"
          titleBarStyle="hidden-inset"
          vibrancy="dark"
          transparent
          webPreferences={{
            experimentalFeatures: true,
            transparentVisuals: true,
          }}
          show={this.state.show}
          size={this.state.size}
          position={this.state.position}
          onReadyToShow={() => this.setState({ show: true })}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
        />
      </app>
    )
  }
}

Ionize.start(<ExampleApp />)
