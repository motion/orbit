import { Screen } from '@mcro/screen'
import { store, react, on, ensure } from '@mcro/black'
import { Desktop, Electron, App } from '@mcro/stores'
import { toJS } from 'mobx'
import { getGlobalConfig } from '@mcro/config'
import { last, isEqual } from 'lodash'
import { Logger } from '@mcro/logger'

const log = new Logger('ContextManager')
const Config = getGlobalConfig()
const ORBIT_APP_ID = Config.isProd ? 'com.o.orbit' : 'com.github.electron'

@store
export class ContextManager {
  screen: Screen
  curAppID = ''

  constructor({ screen }: { screen: Screen }) {
    this.screen = screen
    this.watchContext()
  }

  watchContextOnAcceptPermissions = react(
    () => Desktop.state.operatingSystem.accessibilityPermission,
    isAccessible => {
      ensure('isAccessible', isAccessible)
      this.screen.startWatchingWindows()
    },
  )

  watchContext() {
    this.screen.onWindowChange((event, value) => {
      if (event === 'ScrollEvent') {
        return
      }
      // console.debug('got window change', event, value)
      // console.log(`got event ${event} ${JSON.stringify(value)}`)
      const lastState = toJS(Desktop.appState)
      let appState: any = {}
      let id = this.curAppID
      switch (event) {
        case 'FrontmostWindowChangedEvent':
          id = value.id
          appState = {
            id,
            name: id ? last(id.split('.')) : value.title,
            title: value.title,
            offset: value.position,
            bounds: value.size,
          }
          // update these now so we can use to track
          this.curAppID = id
          break
        case 'WindowPosChangedEvent':
          appState.bounds = value.size
          appState.offset = value.position
      }
      // no change
      if (isEqual(appState, lastState)) {
        log.info('Same app state, ignoring scan')
        return
      }
      const focusedOnOrbit = this.curAppID === ORBIT_APP_ID
      Desktop.setState({ appState, focusedOnOrbit })
    })
  }
}
