import { Mediator } from '@o/bridge'
import { useLocationLink } from '@o/kit'
import { App } from '@o/stores'
import { useEffect } from 'react'

import { AppActions } from '../actions/AppActions'
import { useStores } from './useStores'

export function useMessageHandlers() {
  const { paneManagerStore } = useStores()
  const props = useLocationLink('/app/settings?id=settings&itemId=account')

  useEffect(() => {
    const subscription = Mediator.onData().subscribe(async ({ name, value }) => {
      console.log('got a message', name, value)
      switch (name) {
        case 'HIDE':
          App.setState({ showOrbitMain: false })
          return
        case 'SHOW':
          App.setState({ showOrbitMain: true })
          return
        case 'TOGGLE_SETTINGS':
          App.setState({ showOrbitMain: true })
          paneManagerStore.setPane('settings')
          return
        case 'APP_URL_OPENED':
          await AppActions.finishAuthorization(value)
          props.onClick()
          return
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])
}
