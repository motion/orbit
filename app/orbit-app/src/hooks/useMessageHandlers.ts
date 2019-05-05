import { Mediator } from '@o/bridge'
import { App } from '@o/stores'
import { useEffect } from 'react'
import { AppActions } from '../actions/AppActions'
import { useStores } from './useStores'
import { useLocationLink } from '@o/kit'

export function useMessageHandlers() {
  const { paneManagerStore } = useStores()
  const accountLink = useLocationLink('settings?id=settings&itemId=account')

  useEffect(() => {
    const subscription = Mediator.onData().subscribe(async ({ name, value }) => {
      console.log('got a message', name, value)
      switch (name) {
        case 'HIDE':
          App.setOrbitState({ docked: false })
          return
        case 'SHOW':
          App.setOrbitState({ docked: true })
          return
        case 'CLOSE_APP':
          AppActions.closeApp(+value)
          return
        case 'TOGGLE_SETTINGS':
          AppActions.setOrbitDocked(true)
          paneManagerStore.setActivePaneByType('settings')
          return
        case 'APP_URL_OPENED':
          await AppActions.finishAuthorization(value)
          accountLink()
          return
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])
}
