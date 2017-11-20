import React from 'react'
import { App, Window } from '@mcro/reactron'
import * as Helpers from './helpers'
import { app, globalShortcut, ipcMain, screen } from 'electron'
import repl from 'repl'
import * as Constants from '~/constants'
import mouse from 'osx-mouse'
import { throttle, isEqual, once } from 'lodash'
import MenuItems from './menuItems'
import getCrawler from './helpers/getCrawler'
import escapeStringApplescript from 'escape-string-applescript'
import Path from 'path'

const EXTENSIONS = {
  mobx: 'fmkadmapgofadopljbjfkapdkoienihi',
  react: 'pfgnfdagidkfgccljigdamigbcnndkod',
}

const extensionToID = name => EXTENSIONS[name]
const extensionIDToPath = id =>
  Path.join(__dirname, '..', 'resources', 'extensions', id)
const getExtensions = names => names.map(extensionToID).map(extensionIDToPath)

let onWindows = []
export function onWindow(cb) {
  onWindows.push(cb)
}

export default class Windows extends React.Component {
  // this is an event bus that should be open whenever ora is open
  sendOra = async name => console.log('called this.sendOra before setup', name)

  subscriptions = []
  uid = Math.random()

  oraState = {}
  state = {
    restart: false,
    showSettings: false,
    closeSettings: false,
    size: [0, 0],
    position: [0, 0],
    trayPosition: [0, 0],
  }

  componentDidMount() {
    this.mounted = true
    this.measureAndShow()
    this.screenSize = screen.getPrimaryDisplay().workAreaSize
    this.setState({
      trayPosition: [this.screenSize.width - Constants.ORA_WIDTH, 20],
    })
    onWindows.forEach(cb => cb(this))
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
    for (const [emitter, name, callback] of this.subscriptions) {
      emitter.off(name, callback)
    }
  }

  on(emitter, name, callback) {
    emitter.on(name, callback)
    this.subscriptions.push([emitter, name, callback])
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

  onOra = ref => {
    if (ref) {
      this.oraRef = ref
      this.startOra()
    }
  }

  startOra = once(() => {
    // CLEAR DATA
    if (process.env.CLEAR_DATA) {
      this.oraRef.webContents.session.clearStorageData()
    }
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
    this.on(ipcMain, 'start-ora', event => {
      // setup our event bus
      // this one runs without updating (only used internally)
      this.sendOraSimple = (...args) => event.sender.send(...args)
      // this one updates state
      this.sendOra = async (...args) => {
        event.sender.send(...args)
        return await this.getOraState()
      }
    })

    // if you call this.getOraState() this will handle it
    this.on(ipcMain, 'set-state', (event, state) => {
      // update state
      this.oraState = state
      console.log('updated state', this.oraState)
      if (this.oraStateGetters.length) {
        for (const getter of this.oraStateGetters) {
          getter(state)
        }
        this.oraStateGetters = []
      } else {
        console.log('nothing is listening for state')
      }
    })

    this.on(ipcMain, 'inject-crawler', event => {
      this.injectCrawler(info => {
        event.sender.send('crawler-selection', info)
      })
    })

    this.on(ipcMain, 'open-browser', (event, url) => {
      Helpers.open(url)
    })

    this.on(ipcMain, 'get-context', this.getContext)

    this.on(ipcMain, 'open-settings', (event, service) => {
      Helpers.open(`${Constants.APP_URL}/authorize?service=` + service)
    })
  }

  toggleShown = throttle(async () => {
    await this.sendOra('ora-toggle')
    if (this.oraState.hidden) {
      await Helpers.sleep(200)
      if (this.appRef) {
        this.appRef.hide()
      }
    } else {
      if (!this.appRef) {
        console.log('no app ref :(')
        return
      }
      this.appRef.show()
      await Helpers.sleep(200)
      this.appRef.focus()
      this.oraRef.focus()
    }
  }, 500)

  injectCrawler = throttle(async sendToOra => {
    const js = await getCrawler()
    await Helpers.runAppleScript(`
      tell application "Google Chrome"
        tell front window's active tab
          set source to execute javascript "${escapeStringApplescript(js)}"
        end tell
      end tell
    `)
    this.continueChecking = true
    let lastRes = null
    this.checkCrawlerLoop(res => {
      if (!isEqual(lastRes, res)) {
        sendToOra(res)
        lastRes = res
      }
    })
  }, 500)

  checkCrawlerLoop = async cb => {
    try {
      cb(await this.checkCrawler())
    } catch (err) {
      this.continueChecking = false
      console.log('error with crawl loop', err)
    }
    await Helpers.sleep(500)
    if (!this.mounted) {
      return
    }
    if (this.continueChecking) {
      this.checkCrawlerLoop(cb)
    }
  }

  checkCrawler = throttle(async () => {
    const res = await Helpers.runAppleScript(`
      tell application "Google Chrome"
        tell front window's active tab
          set source to execute javascript "JSON.stringify(window.__oraCrawlerAnswer || {})"
        end tell
      end tell
    `)
    try {
      const result = JSON.parse(res)
      return result
    } catch (err) {
      console.log('error parsing result', err)
      return null
    }
  }, 200)

  lastContext = null

  getContext = throttle(async event => {
    const { application } = await Helpers.getActiveWindowInfo()
    const context = await Helpers.getChromeContext()
    const answer = {
      application,
      ...context,
    }
    event.sender.send('set-context', JSON.stringify(answer))
  }, 200)

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
      onWindows = []
      return (
        <app>
          <window />
        </app>
      )
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

    console.log(App, Window)

    return (
      <App
        onBeforeQuit={() => console.log('hi')}
        ref={ref => {
          this.appRef = ref
        }}
      >
        <MenuItems
          onPreferences={() => {
            this.setState({ showSettings: true })
          }}
          getRef={ref => {
            this.menuRef = ref
          }}
        />
        {!this.state.closeSettings && (
          <Window
            {...appWindow}
            show={this.state.showSettings}
            vibrancy="dark"
            transparent
            hasShadow
            showDevTools={this.state.showSettings}
            defaultSize={this.initialSize || this.state.size}
            size={this.state.size}
            file={`${Constants.APP_URL}/settings`}
            titleBarStyle="customButtonsOnHover"
            position={this.state.position}
            onResize={size => this.setState({ size })}
            onMoved={position => this.setState({ position })}
            onMove={position => this.setState({ position })}
            onClose={() => {
              this.setState({ closeSettings: true })
              setTimeout(() => {
                // reopen invisible so its quick to open again
                this.setState({ closeSettings: false, showSettings: false })
              }, 500)
            }}
          />
        )}
        <Window
          {...appWindow}
          ref={this.onOra}
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
