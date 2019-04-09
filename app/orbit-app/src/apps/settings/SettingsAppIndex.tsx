import { List } from '@o/kit'
import React from 'react'

export function SettingsAppIndex() {
  return (
    <List
      items={[
        {
          id: 'general',
          title: 'General',
          icon: 'cog',
          iconBefore: true,
          subTitle: 'Shortcuts, startup, theme',
        },
        {
          id: 'account',
          title: 'Account',
          icon: 'user',
          iconBefore: true,
          subTitle: 'Manage your account',
        },
      ]}
    />
  )
}
