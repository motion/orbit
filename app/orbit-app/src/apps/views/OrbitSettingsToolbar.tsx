import { App } from '@o/stores'
import { Tab, Tabs } from '@o/ui'
import React from 'react'

import { useOm } from '../../om/om'

export function OrbitSettingsToolbar() {
  const om = useOm()
  const appId = om.state.router.appId

  console.log('appId', appId)

  if (App.isEditing) {
    return null
  }

  return (
    <Tabs
      tabWidth={180}
      centered
      sizeRadius={3}
      active={appId}
      onChange={id => om.actions.router.showAppPage({ id })}
    >
      <Tab id="spaces" key="spaces" icon="layer" label="Spaces" />
      <Tab id="settings" key="settings" icon="cog" label="Settings" />
    </Tabs>
  )
}
