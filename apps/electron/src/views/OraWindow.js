import * as React from 'react'
import { Window } from '@mcro/reactron'
import * as Constants from '~/constants'
import { once } from 'lodash'
import { view } from '@mcro/black'
import Screen from '@mcro/screen'

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

  onOraBlur = () => Screen.setState({ focused: false })
  onOraFocus = () => Screen.setState({ focused: true })
  onOraMoved = oraPosition => {
    Screen.setState({ oraPosition, lastMove: Date.now() })
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
        showDevTools={Screen.state.showDevTools.app}
        size={[Constants.ORA_WIDTH, 1000]}
        file={`${Constants.APP_URL}`}
        position={Screen.state.oraPosition.slice(0)}
        onMoved={this.onOraMoved}
        onMove={this.onOraMoved}
        onBlur={this.onOraBlur}
        onFocus={this.onOraFocus}
        devToolsExtensions={Constants.DEV_TOOLS_EXTENSIONS}
      />
    )
  }
}
