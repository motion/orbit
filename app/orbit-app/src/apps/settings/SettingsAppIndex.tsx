import { List } from '@o/kit'
import React from 'react'

export function SettingsAppIndex() {
  return (
    <List
      items={[
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
      ]}
    />
  )
}
