// @flow
import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import * as Helpers from '~/helpers'

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

  render() {
    return (
      <Window
        alwaysOnTop
        file={`${Constants.APP_URL}/highlights`}
        show={this.state.show}
        frame={false}
        hasShadow={false}
        showDevTools
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
