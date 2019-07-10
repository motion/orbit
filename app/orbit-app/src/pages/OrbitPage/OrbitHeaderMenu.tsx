import { useActiveApps, useStore } from '@o/kit'
import { App } from '@o/stores'
import { ListItem } from '@o/ui'
import React, { memo } from 'react'

import { useOm } from '../../om/om'
import { usePaneManagerStore } from '../../om/stores'

export const OrbitEditAppItem = memo(() => {
  const { isEditing } = useStore(App)
  const { effects } = useOm()
  const { activePane } = usePaneManagerStore()
  const activeApps = useActiveApps()
  const activeApp = activeApps.find(app => activePane.id === `${app.id}`)
  const show = activeApp && activeApp.identifier === 'custom' && !isEditing

  if (!show) {
    return null
  }

  return (
    <ListItem
      title="Edit app"
      icon="code"
      onClick={async () => {
        effects.openCurrentApp()
      }}
    />
  )
})
