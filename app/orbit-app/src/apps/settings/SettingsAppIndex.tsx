import * as React from 'react'
import { useActiveUser } from '../../hooks/useActiveUser'
import { useOrbitFilterableResults } from '../../hooks/useOrbitFilterableResults'
import SelectableList from '../../views/Lists/SelectableList'
import { OrbitSettingsToolbar } from '../sources/SourcesAppIndex'

export default function StetingsAppIndex() {
  const [user] = useActiveUser()
  const results = useOrbitFilterableResults({
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

  return (
    <>
      <OrbitSettingsToolbar />
      <SelectableList minSelected={0} items={results} />
    </>
  )
}
