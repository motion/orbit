import { App } from '@mcro/stores'
import { checkAuthProxy } from './checkAuthProxy'
import { promptForAuthProxy } from './promptForAuthProxy'
import { memoize } from 'lodash'

type IntegrationItem = {
  auth: boolean
  id: string
  title: string
}

const promptForProxy = async () => {
  if (await checkAuthProxy()) {
    return true
  } else {
    const { accepted } = await promptForAuthProxy()
    return accepted
  }
}

export const addIntegrationClickHandler = memoize(
  (item: IntegrationItem) => async ({ currentTarget }) => {
    console.log('add integration', currentTarget, item)
    if (item.auth) {
      App.actions.toggleSelectItem(
        { id: item.id, type: 'view', title: item.title },
        currentTarget,
      )
    } else {
      if (await promptForProxy()) {
        App.actions.openAuth(item.id)
        return true
      } else {
        console.log('failed proxy prompt... show something')
        return false
      }
    }
  },
)
