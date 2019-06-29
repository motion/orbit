import { useActiveApps, useLocationLink, useStore } from '@o/kit'
import { App } from '@o/stores'
import { Button, ListItem, Menu } from '@o/ui'
import React, { memo } from 'react'

import { useOm } from '../../om/om'
import { usePaneManagerStore } from '../../om/stores'

export const OrbitHeaderMenu = memo(function OrbitHeaderMenu() {
  const { effects, state } = useOm()
  const paneManagerStore = usePaneManagerStore()
  const { activePane } = paneManagerStore
  const manageAppLink = useLocationLink(`/app/apps?itemId=${activePane.id}`)

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
      <ListItem title="App Settings" icon="cog" onClick={manageAppLink} />
    </Menu>
  )
})

function OrbitEditAppItem() {
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
