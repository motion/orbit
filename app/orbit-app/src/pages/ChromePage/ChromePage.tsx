import * as React from 'react'
import { AppWrapper } from '../../views'
import { MenuLayer } from './menuLayer/MenuLayer'
import { Theme } from '@mcro/ui'
import { App } from '@mcro/stores'
import { provide, view } from '@mcro/black'
import { SettingStore } from '../../stores/SettingStore'
import { SourcesStore } from '../../stores/SourcesStore'
import { QueryStore } from '../../stores/QueryStore/QueryStore'

@provide({
  settingStore: SettingStore,
  sourcesStore: SourcesStore,
})
@provide({
  queryStore: QueryStore,
})
@view
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
