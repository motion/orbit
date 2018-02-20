import * as React from 'react'
import { Window } from '@mcro/reactron'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Screen from '@mcro/screen'

@view.electron
export default class SettingsWindow {
  componentDidMount() {
    this.react(
      () => Screen.appState.openSettings,
      () => this.handleSettingsVisibility(true),
    )
  }

  handleSettingsVisibility = showSettings => {
    Screen.setState({ showSettings })
  }

  onSettingsSized = size => Screen.setState({ size })
  onSettingsMoved = settingsPosition => Screen.setState({ settingsPosition })
  onSettingsClosed = e => {
    if (!this.isClosing && Screen.state.showSettings) {
      e.preventDefault()
      this.handleSettingsVisibility(false)
    }
  }

  render() {
    if (!Screen.state.showSettings) {
      return null
    }
    return null
    return (
      <Window
        frame={false}
        defaultSize={[700, 500]}
        backgroundColor="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        show={Screen.state.showSettings}
        showDevTools={Screen.state.showDevTools.settings}
        transparent
        hasShadow
        titleBarStyle="hiddenInset"
        defaultSize={Screen.state.size}
        size={Screen.state.size}
        file={`${Constants.APP_URL}/settings`}
        position={Screen.state.settingsPosition}
        onResize={this.onSettingsSized}
        onMoved={this.onSettingsMoved}
        onMove={this.onSettingsMoved}
        onClose={this.onSettingsClosed}
      />
    )
  }
}
