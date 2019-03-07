import { command } from '@o/bridge'
import { getGlobalConfig } from '@o/config'
import { AppDefinition } from '@o/kit'
import { OpenCommand, SetupProxyCommand } from '@o/models'
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
