import React from 'react'
import { App, Window } from '@mcro/reactron'
import * as Helpers from './helpers'
import { globalShortcut, ipcMain, screen } from 'electron'
import repl from 'repl'
import * as Constants from '~/constants'
import { throttle, isEqual, once } from 'lodash'
import MenuItems from './menuItems'
import { view } from '@mcro/black'
import * as Injections from '~/injections'

let onWindows = []
export function onWindow(cb) {
  console.log('onwindow')
  onWindows.push(cb)
}

@view.electron
export default class Windows extends React.Component {
  // this is an event bus that should be open whenever ora is open
  sendOra = async name => console.log('called this.sendOra before setup', name)
  oraState = {}
  state = {
    showDevTools: false,
    restart: false,
    showSettings: false,
    showSettingsDevTools: false,
    size: [0, 0],
    position: [0, 0],
    trayPosition: [0, 0],
    context: null, // osContext
  }

  async updateState(state) {
    await new Promise(res => this.setState(state, res))
    if (this.sendOraSimple) {
      this.sendOraSimple('electron-state', this.state)
    }
  }

  componentWillMount() {
    const { position, size } = Helpers.getAppSize()
    const screenSize = screen.getPrimaryDisplay().workAreaSize
    const trayPosition = [screenSize.width - Constants.ORA_WIDTH, 20]
    this.updateState({ show: true, position, size, screenSize, trayPosition })
  }

  componentDidMount() {
    this.mounted = true
    this.repl = repl.start({
      prompt: '$ > ',
    })
    onWindows.forEach(cb => cb(this))
    Object.assign(this.repl.context, {
      Root: this,
    })
  }

  componentWillUnmount() {
    this.mounted = false
    globalShortcut.unregisterAll()
  }

  handleOraRef = ref => {
    if (ref) {
      this.startOra(ref.window)
    }
  }

  startOra = once(ref => {
    console.log('starting ora')
    this.oraRef = ref

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
    this.setupCrawlerListeners()
    this.setupAuthListeners()

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

    this.on(
      ipcMain,
      'open-browser',
      throttle((event, url) => Helpers.open(url), 200)
    )
    this.on(ipcMain, 'open-settings', throttle(this.handlePreferences, 200))
  }

  setupCrawlerListeners() {
    this.on(ipcMain, 'inject-crawler', throttle(Injections.injectCrawler, 1000))
    this.on(
      ipcMain,
      'uninject-crawler',
      throttle(Injections.uninjectCrawler, 1000)
    )
  }

  setupAuthListeners() {
    const getAuthUrl = service =>
      `${Constants.APP_URL}/authorize?service=` + service
    const openAuthWindow = (e, service) =>
      Injections.openAuth(getAuthUrl(service))
    const closeAuthWindow = (e, service) =>
      Injections.closeChromeTabWithUrl(getAuthUrl(service))
    this.on(ipcMain, 'auth-open', throttle(openAuthWindow, 2000))
    this.on(ipcMain, 'auth-close', throttle(closeAuthWindow, 2000))
  }

  toggleShown = throttle(async () => {
    if (!this.appRef) {
      console.log('no app ref :(')
      return
    }
    if (!this.oraState.hidden) {
      console.log('send toggle')
      await this.sendOra('ora-toggle')
      await Helpers.sleep(150)
      console.log('now hide')
      if (!this.state.showSettings) {
        this.appRef.hide()
      }
    } else {
      this.appRef.show()
      await Helpers.sleep(50)
      await this.sendOra('ora-toggle')
      await Helpers.sleep(150)
      this.appRef.focus()
      this.oraRef.focus()
    }
  }, 200)

  lastContext = null
  lastContextError = null

  watchForContext = () => {
    this.setInterval(async () => {
      let res
      try {
        res = await Helpers.getActiveWindowInfo()
      } catch (err) {
        if (err.message.indexOf(`Can't get window 1 of`)) {
          // super hacky but if it fails it usually gives an error like:
          //   execution error: System Events got an error: Can’t get window 1 of process "Slack"
          // so we can find it:
          const name = err.message.match(/process "([^"]+)"/)
          if (name && name.length) {
            res = { application: name[1], title: name[1] }
          }
        }
        if (!res) {
          if (this.lastContextError !== err.message) {
            console.log('error watching context', err.message)
            this.lastContextError = err.message
          }
        }
      }
      if (res) {
        const { application } = res
        const context = {
          focusedApp: application,
          ...(await Helpers.getChromeContext()),
        }
        if (!isEqual(this.state.context, context)) {
          this.updateState({ context })
        }
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

  componentDidCatch(error) {
    console.error(error)
    this.updateState({ error })
  }

  handlePreferences = () => {
    this.updateState({ showSettings: true })
  }

  handleMenuRef = ref => {
    this.menuRef = ref
  }

  handleMenuQuit = () => {
    this.isClosing = true
  }

  handleMenuClose = () => {
    if (this.state.showSettings) {
      this.updateState({ showSettings: false })
    }
  }

  handleAppRef = ref => {
    if (ref) {
      this.appRef = ref.app
    }
  }

  onBeforeQuit = () => console.log('hi')
  onOraBlur = () => this.sendOra('ora-blur')
  onOraFocus = () => this.sendOra('ora-focus')
  onOraMoved = trayPosition => this.updateState({ trayPosition })

  onSettingsSized = size => this.updateState({ size })
  onSettingsMoved = position => this.updateState({ position })
  onSettingsClosed = e => {
    if (!this.isClosing && this.state.showSettings) {
      e.preventDefault()
      this.updateState({ showSettings: false })
    }
  }

  handleShowDevTools = () => {
    if (this.state.showSettings) {
      this.updateState({
        showSettingsDevTools: !this.state.showSettingsDevTools,
      })
    } else {
      this.updateState({ showDevTools: !this.state.showDevTools })
    }
  }

  render() {
    const { error, restart } = this.state
    if (restart) {
      console.log('RESTARTING')
      this.repl.close()
      // onWindows = []
      return <App key={0} />
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
      <App onBeforeQuit={this.onBeforeQuit} ref={this.handleAppRef}>
        <MenuItems
          onPreferences={this.handlePreferences}
          onShowDevTools={this.handleShowDevTools}
          getRef={this.handleMenuRef}
          onQuit={this.handleMenuQuit}
          onClose={this.handleMenuClose}
        />
        {/* APP: */}
        <Window
          {...appWindow}
          ref={this.handleOraRef}
          transparent
          show
          alwaysOnTop
          hasShadow={false}
          showDevTools={this.state.showDevTools}
          size={[Constants.ORA_WIDTH, 1000]}
          file={`${Constants.APP_URL}`}
          position={this.state.trayPosition}
          onMoved={this.onOraMoved}
          onMove={this.onOraMoved}
          onBlur={this.onOraBlur}
          onFocus={this.onOraFocus}
          devToolsExtensions={Helpers.getExtensions(['mobx', 'react'])}
        />
        {/* SETTINGS PANE: */}
        <Window
          {...appWindow}
          show={this.state.showSettings}
          showDevTools={this.state.showSettingsDevTools}
          transparent
          hasShadow
          titleBarStyle="hiddenInset"
          defaultSize={this.state.size}
          size={this.state.size}
          file={`${Constants.APP_URL}/settings`}
          position={this.state.position}
          onResize={this.onSettingsSized}
          onMoved={this.onSettingsMoved}
          onMove={this.onSettingsMoved}
          onClose={this.onSettingsClosed}
        />
      </App>
    )
  }
}
