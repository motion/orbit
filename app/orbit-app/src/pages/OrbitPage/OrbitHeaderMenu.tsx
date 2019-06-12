import { useActiveApps, useLocationLink, useStore } from '@o/kit'
import { App } from '@o/stores'
import { Button, ListItem, PopoverMenu } from '@o/ui'
import React, { memo } from 'react'

import { useStores } from '../../hooks/useStores'
import { useOm } from '../../om/om'

export const OrbitHeaderMenu = memo(function OrbitHeaderMenu() {
  const { effects, state } = useOm()
  const { paneManagerStore } = useStores()
  const { activePane } = paneManagerStore
  const manageAppLink = useLocationLink(`/app/apps?itemId=${activePane.id}`)

  return (
    <PopoverMenu
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
    </PopoverMenu>
  )
})

function OrbitEditAppItem() {
  const { isEditing } = useStore(App)
  const { effects } = useOm()
  const { paneManagerStore, orbitStore } = useStores()
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
        orbitStore.setEditing()
      }}
    />
  )
}
