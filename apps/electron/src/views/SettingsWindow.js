import * as React from 'react'
import { Window } from '@mcro/reactron'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { App, Electron } from '@mcro/all'

@view.electron
export default class SettingsWindow {
  componentDidMount() {
    this.react(
      () => App.state.openSettings,
      () => this.handleSettingsVisibility(true),
    )
  }

  handleSettingsVisibility = showSettings => {
    Electron.setState({ showSettings })
  }

  onSettingsSized = size => Electron.setState({ size })
  onSettingsMoved = settingsPosition => Electron.setState({ settingsPosition })
  onSettingsClosed = e => {
    if (!this.isClosing && Electron.state.showSettings) {
      e.preventDefault()
      this.handleSettingsVisibility(false)
    }
  }

  render() {
    if (!Electron.state.showSettings) {
      return null
    }
    return (
      <Window
        frame={false}
        defaultSize={[700, 500]}
        backgroundColor="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        show={Electron.state.showSettings}
        showDevTools={Electron.state.showDevTools.settings}
        transparent
        hasShadow
        titleBarStyle="hiddenInset"
        defaultSize={Electron.state.size}
        size={Electron.state.size}
        file={`${Constants.APP_URL}/settings`}
        position={Electron.state.settingsPosition}
        onResize={this.onSettingsSized}
        onMoved={this.onSettingsMoved}
        onMove={this.onSettingsMoved}
        onClose={this.onSettingsClosed}
      />
    )
  }
}
