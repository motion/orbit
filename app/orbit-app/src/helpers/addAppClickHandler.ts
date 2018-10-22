import { checkAuthProxy } from './checkAuthProxy'
import { promptForAuthProxy } from './promptForAuthProxy'
import { memoize } from 'lodash'
import { Actions } from '../actions/Actions'
import { OrbitIntegration } from '../integrations/types'
import { appToAppConfig } from '../stores/AppsStore'

const promptForProxy = async () => {
  if (await checkAuthProxy()) {
    return true
  } else {
    const { accepted } = await promptForAuthProxy()
    return accepted
  }
}

export const addAppClickHandler = memoize(
  (app: OrbitIntegration<any>) => async ({ currentTarget }) => {
    console.log('add integration', currentTarget, app)
    if (app.views.setup) {
      // if this view wants to show a "setup" pane...
      Actions.togglePeekApp(
        {
          ...appToAppConfig(app),
          type: 'setup',
        },
        currentTarget,
      )
    } else {
      // ...otherwise we open browser to oauth
      Actions.clearPeek()
      if (await promptForProxy()) {
        Actions.openAuth(app.integration)
        return true
      } else {
        console.log('failed proxy prompt... show something')
        return false
      }
    }
  },
)
