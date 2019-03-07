import { List, useActiveQueryFilter, useActiveUser } from '@o/kit';
import * as React from 'react';

export function SettingsAppIndex() {
  const [user] = useActiveUser()
  const results = useActiveQueryFilter({
    items: [
      {
        id: 'general',
        title: 'General',
        icon: 'gear',
        iconBefore: true,
        subtitle: 'Shortcuts, startup, theme',
      },
      {
        id: 'account',
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
