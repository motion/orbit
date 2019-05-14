import { isEqual } from '@o/fast-compare'
import { useActiveUser } from '@o/kit'
import { App } from '@o/stores'
import { useEffect } from 'react'

export function useUserEffects() {
  useUserSyncSettings()
}

function useUserSyncSettings() {
  const [user] = useActiveUser()

  useEffect(() => {
    if (!user) return
    if (!isEqual(user.settings, App.state.userSettings)) {
      App.setState({ userSettings: user.settings })
    }
  }, [user])
}
