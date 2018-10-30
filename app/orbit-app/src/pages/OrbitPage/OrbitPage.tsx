import * as React from 'react'
import { provide, react, view, attach } from '@mcro/black'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { AppsStore } from '../../stores/AppsStore'
import { AppWrapper } from '../../views'
import { HighlightsPage } from '../HighlightsPage/HighlightsPage'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { SelectionStore } from '../../stores/SelectionStore'
import { SettingStore } from '../../stores/SettingStore'
import { OrbitStore } from '../../stores/OrbitStore'
import { App } from '@mcro/stores'
import { Col, Theme } from '@mcro/ui'
import { ORBIT_WIDTH } from '@mcro/constants'
import { BORDER_RADIUS } from '../../constants'
import { OrbitChrome } from './OrbitChrome'
import { OrbitPaneManager } from './OrbitPaneManager'

class OrbitPageStore {
  // when we open an app window we have to change our strategy for showing/hiding orbit
  // with only one open we just use electron show/hide entire app, so return true
  // otherwise we use in-app logic here
  shouldShowOrbitDocked = react(
    () => [App.appsState.length, App.orbitState.docked],
    ([numApps, isDocked]) => {
      if (numApps === 1) {
        return true
      } else {
        return isDocked
      }
    },
  )
}

@provide({
  settingStore: SettingStore,
  appsStore: AppsStore,
  orbitWindowStore: OrbitWindowStore,
})
@provide({
  orbitStore: OrbitStore,
})
@provide({
  queryStore: QueryStore,
})
@provide({
  selectionStore: SelectionStore,
})
@attach({
  store: OrbitPageStore,
})
export class OrbitPage extends React.Component<{ store?: OrbitPageStore }> {
  render() {
    console.log('-------- ORBIT PAGE ------------')
    const theme = App.state.darkTheme ? 'clearDark' : 'clearLight'
    // a note:
    // if you try and make this hide on electron hide note one thing:
    // electron stops rendering the app when its hidden
    // so if you "hide" here it will actually flicker when it shows again
    // because it hides in electron before rendering the hide here and then
    // does the hide/show after the toggle
    return (
      <AppWrapper>
        <HighlightsPage />
        <Theme name={theme}>
          <OrbitDockedFrame
            className={`theme-${theme}`}
            visible={this.props.store.shouldShowOrbitDocked}
          >
            <OrbitChrome />
            <OrbitPaneManager />
          </OrbitDockedFrame>
        </Theme>
      </AppWrapper>
    )
  }
}

const OrbitDockedFrame = view(Col, {
  position: 'absolute',
  top: 10,
  right: 10,
  bottom: 10,
  width: ORBIT_WIDTH,
  borderRadius: BORDER_RADIUS + 2,
  zIndex: 2,
  flex: 1,
  pointerEvents: 'none',
  opacity: 0,
  visible: {
    pointerEvents: 'auto',
    opacity: 1,
  },
})
