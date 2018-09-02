import { AppConfig } from '@mcro/stores'
import { checkAuthProxy } from './checkAuthProxy'
import { promptForAuthProxy } from './promptForAuthProxy'
import { memoize } from 'lodash'
import { Actions } from '../actions/Actions'

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
      Actions.togglePeekApp(appConfig, currentTarget)
    } else {
      // clear any existing peek
      Actions.clearPeek()
      if (await promptForProxy()) {
        Actions.openAuth(appConfig.id)
        return true
      } else {
        console.log('failed proxy prompt... show something')
        return false
      }
    }
  },
)
