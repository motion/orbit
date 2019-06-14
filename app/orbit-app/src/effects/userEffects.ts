import { isEqual } from '@o/fast-compare'
import { useActiveUser } from '@o/kit'
import { App } from '@o/stores'
import { useEffect } from 'react'

export function useUserEffects() {
  useUserSyncSettings()
}

// TODO we should be able to get rid of this
// just make electron observeOne(UserModel) instead

function useUserSyncSettings() {
  const [user] = useActiveUser()

  useEffect(() => {
    if (!user) return
    if (!isEqual(user.settings, App.state.userSettings)) {
      App.setState({ userSettings: user.settings })
    }
  }, [user])
}
