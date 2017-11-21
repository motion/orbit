import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Sidebar from './sidebar'

@view
export default class SettingsPage {
  render() {
    return (
      <UI.Theme name="clear-dark">
        <home $$fullscreen>
          <Sidebar items={[{ primary: 'hi22' }]} />
          <content>hi</content>
        </home>
      </UI.Theme>
    )
  }

  static style = {
    home: {
      background: [200, 200, 200, 0.45],
      flex: 1,
      flexFlow: 'row',
    },
    content: {
      flexFlow: 'row',
      flex: 1,
      position: 'relative',
    },
  }
}
