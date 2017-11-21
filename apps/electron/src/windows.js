import React from 'react'
import { App, Window } from '@mcro/reactron'
import * as Helpers from './helpers'
import { globalShortcut, ipcMain, screen } from 'electron'
import repl from 'repl'
import * as Constants from '~/constants'
import mouse from 'osx-mouse'
import { throttle, isEqual, once } from 'lodash'
import MenuItems from './menuItems'
import getCrawler from './helpers/getCrawler'
import Path from 'path'
import { view } from '@mcro/black'

const EXTENSIONS = {
  mobx: 'fmkadmapgofadopljbjfkapdkoienihi',
  react: 'pfgnfdagidkfgccljigdamigbcnndkod',
}

const extensionToID = name => EXTENSIONS[name]
const extensionIDToPath = id =>
  Path.join(__dirname, '..', 'resources', 'extensions', id)
const getExtensions = names => names.map(extensionToID).map(extensionIDToPath)

@view.electron
export default class Windows extends React.Component {
  // this is an event bus that should be open whenever ora is open
  sendOra = async name => console.log('called this.sendOra before setup', name)

  uid = Math.random()

  oraState = {}
  state = {
    restart: false,
    showSettings: false,
    size: [0, 0],
    position: [0, 0],
    trayPosition: [0, 0],
  }

  async setState(state) {
    const setter = super.setState.bind(this)
    await new Promise(res => setter(state, res))
    if (this.sendOraSimple) {
      this.sendOraSimple('electron-state', this.state)
    }
  }

  componentDidMount() {
    this.mounted = true
    this.measureAndShow()
    this.screenSize = screen.getPrimaryDisplay().workAreaSize
    this.setState({
      trayPosition: [this.screenSize.width - Constants.ORA_WIDTH, 20],
    })
    setTimeout(this.measureAndShow, 500)
    this.repl = repl.start({
      prompt: '$ > ',
    })
    Object.assign(this.repl.context, {
      Root: this,
    })
    this.listenForMouse()
  }

  componentWillUnmount() {
    this.mounted = false
    globalShortcut.unregisterAll()
  }

  listenForMouse() {
    this.on(ipcMain, 'mouse-listen', () => {
      const triggerX = this.screenSize.width - 20
      const triggerY = 20
      const mousey = mouse()
      let hasLeftCorner = true
      mousey.on(
        'move',
        throttle((x, y) => {
          if (+x > triggerX && +y < triggerY) {
            if (hasLeftCorner) {
              hasLeftCorner = false
              console.log('IN CORNER')
              this.toggleShown()
            }
          } else {
            hasLeftCorner = true
          }
        }, 60)
      )
    })
  }

  measure = () => {
    const { position, size } = Helpers.getScreenSize()
    this.size = size
    this.position = position
    this.initialSize = this.initialSize || this.size
  }

  oraRef = ref => {
    if (ref) {
      this.oraRef = ref.window
      this.startOra()
    }
  }

  startOra = once(() => {
    // CLEAR DATA
    if (process.env.CLEAR_DATA) {
      this.oraRef.webContents.session.clearStorageData()
    }
    this.watchForContext()
    this.listenToApps()
    this.registerShortcuts()
  })

  oraStateGetters = []
  getOraState = () =>
    new Promise(res => {
      this.oraStateGetters.push(res)
      this.sendOraSimple('get-state')
    })

  onAppWindow = win => electron => {
    if (win && electron && !win.ref) {
      win.ref = electron
    }
  }

  listenToApps = () => {
    this.on(
      ipcMain,
      'start-ora',
      once(event => {
        // setup our event bus
        // this one runs without updating (only used internally)
        this.sendOraSimple = (...args) => event.sender.send(...args)

        // send initial state
        this.sendOraSimple('electron-state', this.state)

        // this one updates state
        this.sendOra = async (...args) => {
          event.sender.send(...args)
          return await this.getOraState()
        }
      })
    )

    // if you call this.getOraState() this will handle it
    this.on(ipcMain, 'set-state', (event, state) => {
      // update state
      this.oraState = state
      if (this.oraStateGetters.length) {
        for (const getter of this.oraStateGetters) {
          getter(state)
        }
        this.oraStateGetters = []
      } else {
        console.log('nothing is listening for state')
      }
    })

    this.on(ipcMain, 'inject-crawler', () => {
      this.injectCrawler()
    })

    this.on(ipcMain, 'open-browser', (event, url) => {
      Helpers.open(url)
    })

    this.on(ipcMain, 'open-settings', (event, service) => {
      Helpers.open(`${Constants.APP_URL}/authorize?service=` + service)
    })
  }

  toggleShown = throttle(async () => {
    if (!this.appRef) {
      console.log('no app ref :(')
      return
    }
    if (!this.oraState.hidden) {
      await this.sendOra('ora-toggle')
      await Helpers.sleep(150)
      this.appRef.hide()
    } else {
      this.appRef.show()
      await Helpers.sleep(50)
      await this.sendOra('ora-toggle')
      await Helpers.sleep(150)
      this.appRef.focus()
      this.oraRef.focus()
    }
  }, 200)

  injectCrawler = throttle(async () => {
    const js = await getCrawler()
    await Helpers.runAppleScript(`
      tell application "Google Chrome"
        tell front window's active tab
          set source to execute javascript "${Helpers.escapeAppleScriptString(
            js
          )}"
        end tell
      end tell
    `)
  }, 500)

  lastContext = null

  watchForContext = () => {
    this.setInterval(async () => {
      const { application } = await Helpers.getActiveWindowInfo()
      const context = {
        focusedApp: application,
        ...(await Helpers.getChromeContext()),
      }
      if (!isEqual(this.state.context, context)) {
        this.setState({ context })
      }
    }, 500)
  }

  SHORTCUTS = {
    'Option+Space': () => {
      console.log('command option+space')
      this.toggleShown()
    },
  }

  registerShortcuts = () => {
    for (const shortcut of Object.keys(this.SHORTCUTS)) {
      const ret = globalShortcut.register(shortcut, this.SHORTCUTS[shortcut])
      if (!ret) {
        console.log('couldnt register shortcut')
      }
    }
  }

  measureAndShow = async () => {
    this.measure()
    this.setState({ show: true, position: this.position, size: this.size })
  }

  componentDidCatch(error) {
    console.error(error)
    this.setState({ error })
  }

  render() {
    const { error, restart } = this.state
    if (restart) {
      console.log('\n\n\n\n\n\nRESTARTING\n\n\n\n\n\n')
      this.repl.close()
      return null
    }
    if (error) {
      console.log('recover render from error')
      return null
    }

    const appWindow = {
      frame: false,
      defaultSize: [700, 500],
      backgroundColor: '#00000000',
      webPreferences: {
        nativeWindowOpen: true,
        experimentalFeatures: true,
        transparentVisuals: true,
      },
    }

    return (
      <App
        onBeforeQuit={() => console.log('hi')}
        ref={ref => {
          if (ref) {
            this.appRef = ref.app
          }
        }}
      >
        <MenuItems
          onPreferences={() => {
            this.setState({ showSettings: true })
          }}
          getRef={ref => {
            this.menuRef = ref
          }}
          onQuit={() => {
            this.isClosing = true
          }}
        />
        <Window
          {...appWindow}
          show={this.state.showSettings}
          showDevTools={this.state.showSettings}
          vibrancy="dark"
          transparent
          hasShadow
          defaultSize={this.initialSize || this.state.size}
          size={this.state.size}
          file={`${Constants.APP_URL}/settings`}
          titleBarStyle="customButtonsOnHover"
          position={this.state.position}
          onResize={size => this.setState({ size })}
          onMoved={position => this.setState({ position })}
          onMove={position => this.setState({ position })}
          onClose={e => {
            if (!this.isClosing && this.state.showSettings) {
              e.preventDefault()
              this.setState({ showSettings: false })
            }
          }}
        />
        <Window
          {...appWindow}
          ref={this.oraRef}
          titleBarStyle="customButtonsOnHover"
          transparent
          show
          alwaysOnTop
          showDevTools
          size={[Constants.ORA_WIDTH, 1000]}
          file={`${Constants.APP_URL}/ora`}
          position={this.state.trayPosition}
          onMoved={trayPosition => this.setState({ trayPosition })}
          onMove={trayPosition => this.setState({ trayPosition })}
          onBlur={() => this.sendOra('ora-blur')}
          onFocus={() => this.sendOra('ora-focus')}
          devToolsExtensions={getExtensions(['mobx', 'react'])}
        />
      </App>
    )
  }
}
