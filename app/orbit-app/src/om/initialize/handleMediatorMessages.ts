import { Mediator } from '@o/kit'

import { om } from '../om'

export function handleMediatorMessages() {
  Mediator.onData().subscribe(async ({ name, value }) => {
    console.log('got a message', name, value)
    switch (name) {
      case 'TOGGLE_SETTINGS':
        om.actions.router.showAppPage({ id: 'settings' })
        return
      case 'APP_URL_OPENED':
        console.warn('APP_URL_OPENED')
        await AppActions.finishAuthorization(value)
        om.actions.router.showAppPage({ id: 'settings', subId: 'account' })
        return
    }
  })
}
