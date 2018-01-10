import * as React from 'react'
import { Tray } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import * as Constants from '~/constants'

@view.electron
export default class TrayEl {
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
        onClick={() => console.log('clicked')}
        {...props}
      />
    )
  }
}
