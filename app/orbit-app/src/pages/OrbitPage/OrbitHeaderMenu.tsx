import { useActiveApps, useLocationLink, useStore } from '@o/kit'
import { App } from '@o/stores'
import { Button, ListItem, PassProps, Popover } from '@o/ui'
import React, { memo } from 'react'

import { useStores } from '../../hooks/useStores'
import { useOm } from '../../om/om'

export const OrbitHeaderMenu = memo(function OrbitHeaderMenu() {
  const { effects, state } = useOm()
  const { paneManagerStore } = useStores()
  const { activePane } = paneManagerStore
  const props = useLocationLink(`/app/apps?itemId=${activePane.id}`)

  return (
    <Popover
      openOnClick
      closeOnClickAway
      closeOnClick
      width={260}
      background
      elevation={5}
      target={
        <Button
          iconSize={16}
          tooltip="App menu"
          icon="more"
          iconProps={{ transform: { rotate: '90deg' } }}
        />
      }
    >
      <PassProps>
        <ListItem
          {...{
            title: 'Permalink',
            subTitle: state.router.urlString,
            icon: 'link',
            onClick: effects.copyAppLink,
          }}
        />
        <OrbitEditAppItem />
        <ListItem
          {...{
            title: 'App Settings',
            icon: 'cog',
            ...props,
          }}
        />
      </PassProps>
    </Popover>
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
