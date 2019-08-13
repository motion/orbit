import { App, AppViewProps, createApp } from '@o/kit'
import { List } from '@o/ui'
import React from 'react'

import SettingsAppAccount from './SettingsAppAccount'
import { SettingsAppGeneral } from './SettingsAppGeneral'

export default createApp({
  id: 'settings',
  name: 'Settings',
  icon: 'cog',
  app: props => (
    <App index={<SettingsAppIndex />}>
      <SettingsAppMain {...props} />
    </App>
  ),
})

export function SettingsAppIndex() {
  return (
    <List
      alwaysSelected
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

export function SettingsAppMain(props: AppViewProps) {
  switch (props.id) {
    case 'general':
      return <SettingsAppGeneral {...props} />
    case 'account':
      return <SettingsAppAccount />
    default:
      return <div>no found pane in settings {JSON.stringify(props)}</div>
  }
}
