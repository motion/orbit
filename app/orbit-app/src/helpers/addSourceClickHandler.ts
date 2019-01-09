import { command } from '@mcro/model-bridge'
import { memoize } from 'lodash'
import { AppActions } from '../actions/AppActions'
import { OrbitIntegration } from '../sources/types'
import { sourceToAppConfig } from '../stores/SourcesStore'
import { getGlobalConfig } from '@mcro/config'
import { SetupProxyCommand, OpenCommand } from '@mcro/models'

export const addSourceClickHandler = memoize(
  (app: OrbitIntegration<any>) => async (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (app.views.setup) {
      // if this view wants to show a "setup" pane...
      AppActions.togglePeekApp({
        target: e.currentTarget,
        appConfig: {
          ...sourceToAppConfig(app, { target: 'source' }),
          viewType: 'setup',
        },
      })
    } else {
      // ...otherwise we open browser to oauth
      console.log('opening...')

      if (await command(SetupProxyCommand)) {
        const url = `${getGlobalConfig().urls.auth}/auth/${app.integration}`
        console.log('proxy setup success, opening...', url)
        await command(OpenCommand, {
          url,
        })
      }
    }
  },
)
