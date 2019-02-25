import { command } from '@mcro/bridge'
import { getGlobalConfig } from '@mcro/config'
import { AppPackage } from '@mcro/kit'
import { OpenCommand, SetupProxyCommand } from '@mcro/models'
import { memoize } from 'lodash'

export const addSourceClickHandler = memoize((app: AppPackage) => async (e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
  // ...otherwise we open browser to oauth
  console.log('opening...')
  addSource(app)
})

export async function addSource(app: AppPackage) {
  if (await command(SetupProxyCommand)) {
    const url = `${getGlobalConfig().urls.auth}/auth/${app.id}`
    console.log('proxy setup success, opening...', url)
    await command(OpenCommand, {
      url,
    })
  }
}
