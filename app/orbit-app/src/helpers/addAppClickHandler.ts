import { command } from '@mcro/model-bridge'
import { AuthorizeIntegrationCommand } from '@mcro/models'
import { memoize } from 'lodash'
import { AppActions } from '../actions/AppActions'
import { open } from '../actions/appActionsHandlers'
import { OrbitIntegration } from '../sources/types'
import { sourceToAppConfig } from '../stores/SourcesStore'
import { getGlobalConfig } from '@mcro/config'

export const addAppClickHandler = memoize(
  (app: OrbitIntegration<any>) => async ({ currentTarget }) => {
    console.log('add integration', currentTarget, app)
    if (app.views.setup) {
      // if this view wants to show a "setup" pane...
      AppActions.togglePeekApp({
        target: currentTarget,
        appType: 'source',
        appConfig: {
          ...sourceToAppConfig(app),
          viewType: 'setup',
        },
      })
    } else {
      // ...otherwise we open browser to oauth
      AppActions.clearPeek()
      await command(AuthorizeIntegrationCommand)
      open(`${getGlobalConfig().urls.auth}/auth/${app.integration}`)

    }
  },
)
