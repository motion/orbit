import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import { Window } from '@mcro/reactron'
import * as Helpers from '~/helpers'
import { Electron, Desktop } from '@mcro/all'

class MainStore {
  get mouseInActiveArea() {
    return Desktop.hoverState.peekHovered || Desktop.hoverState.orbitHovered
  }
}

@view.attach('electronStore')
@view.provide({
  store: MainStore,
})
@view.electron
export default class MainWindow extends React.Component {
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

  render({ store, electronStore, onRef }) {
    return (
      <Window
        alwaysOnTop
        ignoreMouseEvents={!store.mouseInActiveArea}
        ref={ref => ref && onRef(ref.window)}
        file={Constants.APP_URL}
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
