import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import * as Helpers from '~/helpers'
import { Electron } from '@mcro/all'

@view.attach('electronStore')
@view.electron
export default class HighlightsWindow extends React.Component {
  state = {
    show: false,
    position: [0, 0],
  }

  handleReadyToShow = () => {
    this.setState({
      show: true,
    })
  }

  handleMove = position => {
    this.setState({ position })
  }

  render({ electronStore }) {
    return (
      <Window
        alwaysOnTop
        ignoreMouseEvents
        file={`${Constants.APP_URL}/highlights`}
        show={electronStore.show ? this.state.show : false}
        opacity={electronStore.show === 1 ? 0 : 1}
        frame={false}
        hasShadow={false}
        showDevTools={Electron.state.showDevTools.highlights}
        transparent
        background="#00000000"
        webPreferences={Constants.WEB_PREFERENCES}
        onReadyToShow={this.handleReadyToShow}
        position={this.state.position}
        size={Helpers.getScreenSize()}
        onMove={this.handleMove}
      />
    )
  }
}
