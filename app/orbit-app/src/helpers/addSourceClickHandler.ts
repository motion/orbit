import { getGlobalConfig } from '@mcro/config'
import { command } from '../mediator'
import { OpenCommand, SetupProxyCommand } from '@mcro/models'
import { memoize } from 'lodash'
import { OrbitIntegration } from '../sources/types'

export const addSourceClickHandler = memoize(
  (app: OrbitIntegration<any>) => async (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    // ...otherwise we open browser to oauth
    console.log('opening...')
    addSource(app)
  },
)

export async function addSource(app: OrbitIntegration<any>) {
  if (await command(SetupProxyCommand)) {
    const url = `${getGlobalConfig().urls.auth}/auth/${app.integration}`
    console.log('proxy setup success, opening...', url)
    await command(OpenCommand, {
      url,
    })
  }
}
