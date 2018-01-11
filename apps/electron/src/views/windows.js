import * as React from 'react'
import { Window } from '@mcro/reactron'
import * as Helpers from '~/helpers'
import { ipcMain, screen } from 'electron'
import * as Constants from '~/constants'
import { throttle, once } from 'lodash'
import MenuItems from './menuItems'
import { view } from '@mcro/black'
import PeekWindow from './windows/PeekWindow'
import HighlightsWindow from './windows/HighlightsWindow'

@view.attach('rootStore')
@view.electron
export default class Windows extends React.Component {
  get rootStore() {
    return this.props.rootStore
  }

  // this gets synced down to the browser
  // see oraStore 'electron-state'
  state = {
    showDevTools: false,
    restart: false,
    loadSettings: false,
    showSettings: false,
    showSettingsDevTools: false,
    size: [0, 0],
    settingsPosition: [0, 0],
    oraPosition: [0, 0],
    context: null, // osContext
    lastMove: Date.now(),
  }

  stateUpdate = []

  async updateState(state) {
    await new Promise(res => this.setState(state, res))
    this.sendOraState()
  }

  sendOraState() {
    if (this.rootStore.sendOra) {
      this.rootStore.sendOra('electron-state', this.state)
    }
  }

  componentWillMount() {
    const { position, size } = Helpers.getAppSize()
    const screenSize = screen.getPrimaryDisplay().workAreaSize
    const oraPosition = [screenSize.width - Constants.ORA_WIDTH, 20]
    this.updateState({
      show: true,
      settingsPosition: position,
      size,
      screenSize,
      oraPosition,
    })
  }

  componentDidMount() {
    // unimportant, load after other things done
    this.setTimeout(() => {
      this.setState({ loadSettings: true })
    }, 2000)
  }

  handleOraRef = ref => {
    if (ref && !this.oraRef) {
      this.startOra(ref.window)
    }
  }

  startOra = once(ref => {
    this.oraRef = ref
    this.props.onOraRef(ref)
    // CLEAR DATA
    if (process.env.CLEAR_DATA) {
      this.oraRef.webContents.session.clearStorageData()
    }
    this.listenToApps()
    // send initial state
    this.watch(function sendInitialState() {
      if (this.rootStore.sendOra) {
        console.log('send init electron state')
        this.rootStore.sendOra('electron-state', this.state)
      }
    })
  })

  onAppWindow = win => electron => {
    if (win && electron && !win.ref) {
      win.ref = electron
    }
  }

  handlePeekWindows = peekWindows => {
    this.updateState({ peekWindows })
  }

  listenToApps = () => {
    this.on(ipcMain, 'open-settings', throttle(this.handlePreferences, 200))
  }

  handlePreferences = () => {
    this.handleSettingsVisibility(true)
  }

  handleMenuQuit = () => {
    this.isClosing = true
  }

  handleMenuClose = () => {
    if (this.state.showSettings) {
      this.handleSettingsVisibility(false)
    }
  }

  updateSettingsVisibility = showSettings => {
    this.updateState({ showSettings })
    this.props.onSettingsVisibility(showSettings)
  }

  onBeforeQuit = () => console.log('hi')
  onOraBlur = () => this.rootStore.sendOraSync('ora-blur')
  onOraFocus = () => this.rootStore.sendOraSync('ora-focus')
  onOraMoved = oraPosition => {
    this.updateState({ oraPosition, lastMove: Date.now() })
  }

  onSettingsSized = size => this.updateState({ size })
  onSettingsMoved = settingsPosition => this.updateState({ settingsPosition })
  onSettingsClosed = e => {
    if (!this.isClosing && this.state.showSettings) {
      e.preventDefault()
      this.handleSettingsVisibility(false)
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
    const appWindow = {
      frame: false,
      defaultSize: [700, 500],
      backgroundColor: '#00000000',
      webPreferences: Constants.WEB_PREFERENCES,
    }
    return (
      <React.Fragment>
        <MenuItems
          onPreferences={this.handlePreferences}
          onShowDevTools={this.handleShowDevTools}
          onQuit={this.handleMenuQuit}
          onClose={this.handleMenuClose}
        />
        {/* HIGHLIGHTS: */}
        <HighlightsWindow />
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
          position={this.state.oraPosition}
          onMoved={this.onOraMoved}
          onMove={this.onOraMoved}
          onBlur={this.onOraBlur}
          onFocus={this.onOraFocus}
          devToolsExtensions={Helpers.getExtensions(['mobx', 'react'])}
        />
        <PeekWindow
          appPosition={this.state.oraPosition}
          onWindows={this.handlePeekWindows}
        />
        {/* SETTINGS PANE: */}
        {this.state.loadSettings && (
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
            position={this.state.settingsPosition}
            onResize={this.onSettingsSized}
            onMoved={this.onSettingsMoved}
            onMove={this.onSettingsMoved}
            onClose={this.onSettingsClosed}
          />
        )}
      </React.Fragment>
    )
  }
}
