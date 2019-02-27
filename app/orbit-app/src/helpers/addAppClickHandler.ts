import { command } from '@mcro/bridge'
import { getGlobalConfig } from '@mcro/config'
import { AppDefinition } from '@mcro/kit'
import { OpenCommand, SetupProxyCommand } from '@mcro/models'
import { memoize } from 'lodash'

export const addAppClickHandler = memoize((app: AppDefinition) => async (e: any) => {
  e.stopPropagation()
  e.preventDefault()
  addSource(app)
})

export async function addSource(app: AppDefinition) {
  if (await command(SetupProxyCommand)) {
    const url = `${getGlobalConfig().urls.auth}/auth/${app.id}`
    console.log('proxy setup success, opening...', url)
    await command(OpenCommand, {
      url,
    })
  }
}
