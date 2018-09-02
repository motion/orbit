import { App, AppConfig } from '@mcro/stores'
import { checkAuthProxy } from './checkAuthProxy'
import { promptForAuthProxy } from './promptForAuthProxy'
import { memoize } from 'lodash'

const promptForProxy = async () => {
  if (await checkAuthProxy()) {
    return true
  } else {
    const { accepted } = await promptForAuthProxy()
    return accepted
  }
}

export const addIntegrationClickHandler = memoize(
  (appConfig: AppConfig) => async ({ currentTarget }) => {
    console.log('add integration', currentTarget, appConfig)
    if (appConfig.type === 'view') {
      App.actions.togglePeekApp(appConfig, currentTarget)
    } else {
      // clear any existing peek
      App.actions.clearPeek()
      if (await promptForProxy()) {
        App.actions.openAuth(appConfig.id)
        return true
      } else {
        console.log('failed proxy prompt... show something')
        return false
      }
    }
  },
)
