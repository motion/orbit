import { command } from '@mcro/model-bridge'
import { memoize } from 'lodash'
import { OrbitIntegration } from '../sources/types'
import { getGlobalConfig } from '@mcro/config'
import { SetupProxyCommand, OpenCommand } from '@mcro/models'

export const addSourceClickHandler = memoize(
  (app: OrbitIntegration<any>) => async (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    // ...otherwise we open browser to oauth
    console.log('opening...')

    if (await command(SetupProxyCommand)) {
      const url = `${getGlobalConfig().urls.auth}/auth/${app.integration}`
      console.log('proxy setup success, opening...', url)
      await command(OpenCommand, {
        url,
      })
    }
  },
)
