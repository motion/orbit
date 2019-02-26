import { useEffect } from 'react'
import { AppActions } from '../actions/appActions/AppActions'
import { App } from '@mcro/stores'
import { Mediator } from '@mcro/bridge'
import { useStores } from './useStores'

export function useMessageHandlers() {
  const { paneManagerStore } = useStores()

  useEffect(
    () => {

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
        }
      })
      return () => {
        subscription.unsubscribe()
      }
    },
    [],
  )
}
