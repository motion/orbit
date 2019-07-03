import { useActiveApps, useStore } from '@o/kit'
import { App } from '@o/stores'
import { Button, ListItem, Menu } from '@o/ui'
import React, { memo } from 'react'

import { om, useOm } from '../../om/om'
import { usePaneManagerStore } from '../../om/stores'

const goToAppSettings = () => {
  om.actions.router.showAppPage({
    id: 'apps',
    subId: paneManagerStore.activePane.id,
  })
}

export const OrbitHeaderMenu = memo(() => {
  const { effects, state } = useOm()

  return (
    <Menu
      target={
        <Button tooltip="App menu" icon="more" iconProps={{ transform: { rotate: '90deg' } }} />
      }
    >
      <ListItem
        title="Permalink"
        subTitle={state.router.urlString}
        icon="link"
        onClick={effects.copyAppLink}
      />
      <OrbitEditAppItem />
      <ListItem title="App Settings" icon="cog" onClick={goToAppSettings} />
    </Menu>
  )
})

const OrbitEditAppItem = () => {
  const { isEditing } = useStore(App)
  const { effects } = useOm()
  const paneManagerStore = usePaneManagerStore()
  const activePaneId = paneManagerStore.activePane.id
  const activeApps = useActiveApps()
  const activeApp = activeApps.find(app => activePaneId === `${app.id}`)
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
}
