import { List, useActiveQueryFilter } from '@mcro/kit'
import { useActiveUser } from '@mcro/kit/src/hooks/useActiveUser'
import * as React from 'react'

export function SettingsAppIndex() {
  const [user] = useActiveUser()
  const results = useActiveQueryFilter({
    items: [
      {
        group: 'Settings',
        subType: 'general',
        title: 'General',
        icon: 'gear',
        iconBefore: true,
        subtitle: 'Shortcuts, startup, theme',
      },
      {
        group: 'Settings',
        subType: 'account',
        title: 'Account',
        icon: 'users_badge',
        iconBefore: true,
        subtitle: 'Manage your account',
      },
    ],
  })

  if (!user) {
    return null
  }

  return <List minSelected={0} items={results} />
}
