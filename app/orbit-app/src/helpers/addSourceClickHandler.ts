import { command } from '@mcro/model-bridge'
import { memoize } from 'lodash'
import { AppActions } from '../actions/AppActions'
import { open } from '../actions/appActionsHandlers'
import { OrbitIntegration } from '../sources/types'
import { sourceToAppConfig } from '../stores/SourcesStore'
import { getGlobalConfig } from '@mcro/config'
import { SetupProxyCommand } from '@mcro/models'

export const addSourceClickHandler = memoize(
  (app: OrbitIntegration<any>) => async ({ currentTarget }) => {
    console.log('add integration', currentTarget, app)
    if (app.views.setup) {
      // if this view wants to show a "setup" pane...
      AppActions.togglePeekApp({
        target: currentTarget,
        appConfig: {
          ...sourceToAppConfig(app),
          viewType: 'setup',
        },
      })
    } else {
      // ...otherwise we open browser to oauth
      AppActions.clearPeek()
      await command(SetupProxyCommand)
      open(`${getGlobalConfig().urls.auth}/auth/${app.integration}`)
    }
  },
)
