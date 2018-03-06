import * as React from 'react'
import { Window } from '@mcro/reactron'
import * as Constants from '~/constants'
import { once } from 'lodash'
import { view } from '@mcro/black'
import { Electron } from '@mcro/screen'

@view.electron
export default class Windows {
  handleOraRef = ref => ref && this.startOra(ref.window)

  startOra = once(ref => {
    this.oraRef = ref
    this.props.onRef(ref)
    // CLEAR DATA
    if (process.env.CLEAR_DATA) {
      this.oraRef.webContents.session.clearStorageData()
    }
  })

  onOraBlur = () => Electron.setState({ focused: false })
  onOraFocus = () => Electron.setState({ focused: true })
  onOraMoved = oraPosition => {
    Electron.setState({ oraPosition, lastMove: Date.now() })
  }

  render() {
    return (
      <Window
        frame={false}
        defaultSize={[700, 500]}
        backgroundColor="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        ref={this.handleOraRef}
        transparent
        show
        alwaysOnTop
        hasShadow={false}
        showDevTools={Electron.state.showDevTools.app}
        size={[Constants.ORA_WIDTH, 1000]}
        file={`${Constants.APP_URL}`}
        position={Electron.state.oraPosition.slice(0)}
        onMoved={this.onOraMoved}
        onMove={this.onOraMoved}
        onBlur={this.onOraBlur}
        onFocus={this.onOraFocus}
        devToolsExtensions={Constants.DEV_TOOLS_EXTENSIONS}
      />
    )
  }
}
