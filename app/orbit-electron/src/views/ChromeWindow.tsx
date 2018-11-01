import * as React from 'react'
import { view, sleep } from '@mcro/black'
import { Window } from '@mcro/reactron'
import { Electron } from '@mcro/stores'
import { getGlobalConfig } from '@mcro/config'
import { WEB_PREFERENCES } from '../constants'
import { getScreenSize } from '../helpers/getScreenSize'
import { screen } from 'electron'

const Config = getGlobalConfig()

@view
export class ChromeWindow extends React.Component {
  state = {
    show: false,
    size: [0, 0],
  }

  componentDidMount() {
    this.handleReadyToShow()
    screen.on('display-metrics-changed', async () => {
      // give it a bit to adjust
      await sleep(100)
      this.handleReadyToShow()
    })
  }

  handleReadyToShow = () => {
    this.setState({
      show: true,
      screenSize: getScreenSize(),
    })
  }

  render() {
    const { show, size } = this.state
    console.log('render ChromeWindow with', size, '\n\n', Electron.state.screenSize)
    return (
      <Window
        alwaysOnTop={[true, 'floating', 2]}
        show={show}
        focus={false}
        ignoreMouseEvents={!Electron.hoverState.peekHovered['menu']}
        focusable
        file={`${Config.urls.server}/chrome`}
        frame={false}
        hasShadow={false}
        showDevTools={Electron.state.showDevTools[`menu`] || false}
        transparent
        background="#00000000"
        webPreferences={WEB_PREFERENCES}
        position={[0, 0]}
        size={Electron.state.screenSize.slice()}
      />
    )
  }
}
