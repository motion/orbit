import React from 'react'
import { app, globalShortcut, ipcMain, screen } from 'electron'
import repl from 'repl'
// import localShortcut from 'electron-localshortcut'
import open from 'opn'
import Menu from '~/menu'
import { measure } from '~/helpers'
import * as Constants from '~/constants'
import WindowsStore from './windowsStore'
import Window from './window'

console.log('hi')

let onWindows = []
export function onWindow(cb) {
  onWindows.push(cb)
}

console.log('Constants.APP_URL', Constants.APP_URL)

const AppWindows = new WindowsStore()
const ORA_WIDTH = 300

export default class ExampleApp extends React.Component {
  state = {
    restart: false,
    show: true,
    size: [0, 0],
    position: [0, 0],
    trayPosition: [0, 0],
    appWindows: AppWindows.windows,
  }

  componentDidMount() {
    console.log('did mount windows')
    this.measureAndShow()

    const screenSize = screen.getPrimaryDisplay().workAreaSize
    this.setState({ trayPosition: [screenSize.width - ORA_WIDTH - 20, 40] })

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

  // turns out you can move it pretty fast
  // but not fast enough to be a smooth animation
  // movearound() {
  //   setInterval(() => {
  //     const amt = Math.round(Math.random() * 20)
  //     const { position } = this.state
  //     this.setState({
  //       position: [position[0] + amt, position[1] + amt],
  //     })
  //   }, 30)
  // }

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
      open(`${Constants.APP_URL}/settings?service=` + service)
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

    const webPreferences = {
      // nativeWindowOpen: true,
      experimentalFeatures: true,
      // transparentVisuals: true,
    }

    const appWindow = {
      frame: false,
      defaultSize: [700, 500],
      backgroundColor: '#00000000',
      webPreferences,
    }

    if (error) {
      console.log('recover render from error')
      return null
    }

    return (
      <app onBeforeQuit={() => console.log('hi')}>
        <Menu />

        {false && (
          <window
            key="search"
            {...appWindow}
            vibrancy="dark"
            transparent
            hasShadow
            defaultSize={this.initialSize || this.state.size}
            size={this.state.size}
            ref={this.onWindow}
            showDevTools={true || !Constants.IS_PROD}
            file={Constants.APP_URL}
            titleBarStyle="customButtonsOnHover"
            show={this.state.show}
            position={this.state.position}
            onResize={size => this.setState({ size })}
            onMoved={position => this.setState({ position })}
            onMove={position => this.setState({ position })}
            onFocus={() => {
              this.activeWindow = this.windowRef
            }}
          />
        )}

        <window
          key="tray"
          {...appWindow}
          titleBarStyle="customButtonsOnHover"
          showDevTools
          transparent
          show
          alwaysOnTop
          vibrancy={false && 'ultra-dark'}
          size={[ORA_WIDTH, 500]}
          file={`${Constants.APP_URL}/ora`}
          position={this.state.trayPosition}
          onMoved={trayPosition => this.setState({ trayPosition })}
          onMove={trayPosition => this.setState({ trayPosition })}
        />

        {appWindows.map(win => {
          return (
            <Window
              key={win.key}
              file={`${Constants.APP_URL}?key=${win.key}`}
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
