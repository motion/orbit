import React from 'react'
import { app, globalShortcut, ipcMain } from 'electron'
import repl from 'repl'
import localShortcut from 'electron-localshortcut'
import open from 'opn'
import Menu from '~/menu'
import { measure } from '~/helpers'
import * as Constants from '~/constants'
import WindowsStore from './windowsStore'
import Window from './window'

let onWindows = []
export function onWindow(cb) {
  onWindows.push(cb)
}

const AppWindows = new WindowsStore()

export default class ExampleApp extends React.Component {
  state = {
    restart: false,
    show: true,
    size: [0, 0],
    position: [0, 0],
    appWindows: AppWindows.windows,
  }

  componentDidMount() {
    this.measureAndShow()
    this.next() // preload one app window
    onWindows.forEach(cb => cb(this))
    setTimeout(this.measureAndShow, 500)
    this.repl = repl.start({
      prompt: 'electron > ',
    })
    Object.assign(this.repl.context, {
      Root: this,
      AppWindows: AppWindows,
    })
    console.log('started a repl!')
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

  onAppWindow = win => electron => {
    if (win && electron && !win.ref) {
      win.ref = electron

      // dev-tools helpers, from electron-debug
      const toggleDevTools = () => {
        win.showDevTools = !win.showDevTools
        this.updateWindows()
      }

      localShortcut.register(
        Constants.IS_MAC ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
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
      console.log('where-to from', key)
      const win = AppWindows.findBy(key)
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

    ipcMain.on('close', (event, key) => {
      AppWindows.removeByKey(+key)
      this.updateWindows()
    })

    ipcMain.on('app-bar-toggle', (event, key) => {
      AppWindows.findBy(key).toggleBar()
      this.updateWindows()
      event.sender.send('app-bar-toggle', 'success')
    })

    ipcMain.on('open-settings', (event, service) => {
      open('http://jot.dev/settings?service=' + service)
    })
  }

  updateWindows = () => {
    return new Promise(resolve => {
      this.setState(
        {
          appWindows: AppWindows.windows,
        },
        resolve
      )
    })
  }

  next = path => {
    const next = AppWindows.next(path)
    this.updateWindows()
    return next
  }

  openApp = path => {
    this.hide()
    const next = this.next(path)
    if (next) {
      setTimeout(() => next.ref && next.ref.focus(), 100)
    }
  }

  registerShortcuts = () => {
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
    this.measure()
    await this.show()
    this.windowRef.focus()
  }

  componentDidCatch(error) {
    console.error(error)
    this.setState({ error })
  }

  uid = Math.random()

  render() {
    const { appWindows, error, restart } = this.state

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
      console.log('recover render from error')
      return null
    }

    const bgPadding = 30
    const bgWindow = {
      ...appWindow,
      vibrancy: 'dark',
    }

    return (
      <app onBeforeQuit={() => console.log('hi')}>
        <Menu />
        <window
          key="bar"
          {...bgWindow}
          defaultSize={this.initialSize || this.state.size}
          size={this.state.size}
          ref={this.onWindow}
          showDevTools
          file={Constants.JOT_URL}
          titleBarStyle="customButtonsOnHover"
          show={this.state.show}
          size={this.state.size.map(x => x + bgPadding * 2)}
          position={this.state.position.map(val => val - bgPadding)}
          onResize={size =>
            this.setState({ size: size.map(x => x - bgPadding * 2) })}
          onMoved={position =>
            this.setState({ position: position.map(v => v + bgPadding) })}
          onMove={position => {
            console.log('called move')
            this.setState({ position: position.map(v => v + bgPadding) })
          }}
          onFocus={() => {
            this.activeWindow = this.windowRef
          }}
          webPreferences={{
            nativeWindowOpen: true,
            experimentalFeatures: true,
            transparentVisuals: true,
          }}
        />
        {appWindows.map(win => {
          return (
            <Window
              key={win.key}
              file={`${Constants.JOT_URL}?key=${win.key}`}
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
                AppWindows.removeByKey(win.key)
                this.updateWindows()
              }}
              onFocus={() => {
                win.showDevTools = true
                win.focused = true
                this.activeWindow = win
                this.updateWindows()
              }}
              onBlur={() => {
                if (!win) {
                  console.log('no window weird')
                  return
                }
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
