import { isEqual } from '@o/fast-compare'
import { useActiveUser } from '@o/kit'
import { App, isEditing } from '@o/stores'
import { useEffect, useRef } from 'react'

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
        if (!isEditing) {
          App.setOrbitState({ docked: true })
        }
      }
    },
    [user],
  )
}
