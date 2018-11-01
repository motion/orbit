import * as React from 'react'
import { AppWrapper } from '../../views'
import { MenuLayer } from './menuLayer/MenuLayer'
import { Theme } from '@mcro/ui'
import { App } from '@mcro/stores'

export class ChromePage extends React.Component {
  render() {
    const theme = App.state.darkTheme ? 'clearDark' : 'clearLight'
    return (
      <Theme name={theme}>
        <AppWrapper>
          <MenuLayer />
        </AppWrapper>
      </Theme>
    )
  }
}
