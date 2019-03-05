import { isEqual } from '@mcro/fast-compare'
import { useActiveUser } from '@mcro/kit'
import { App } from '@mcro/stores'
import { useEffect, useRef } from 'react'
import { getIsTorn } from '../helpers/getIsTorn'

export function useUserEffects() {
  useUserSyncSettings()
}

function useUserSyncSettings() {
  const [user] = useActiveUser()
  const hasStarted = useRef(false)

  useEffect(
    () => {
      if (!user) return
      if (!isEqual(user.settings, App.state.userSettings)) {
        App.setState({ userSettings: user.settings })
      }
      if (!hasStarted.current) {
        hasStarted.current = true
        if (!getIsTorn()) {
          App.setOrbitState({ docked: true })
        }
      }
    },
    [user],
  )
}
