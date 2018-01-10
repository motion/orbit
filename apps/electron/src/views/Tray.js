import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import * as Constants from '~/constants'

@view.attach('rootStore')
@view.electron
export default class TrayEl {
  get rootStore() {
    return this.props.rootStore
  }

  componentDidMount() {
    console.log('mounted tray')
    this.react(
      () => this.rootStore.oraState,
      oraState => {
        console.log('got new oraState', oraState)
      },
      true,
    )
  }

  render(props) {
    return (
      <Tray
        image={Path.join(
          Constants.ROOT_PATH,
          'resources',
          'icons',
          'orbitTemplate.png',
        )}
        title="Test out the tray"
        {...props}
      />
    )
  }
}
