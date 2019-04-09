import { ListItem, useActiveApps, useLocationLink } from '@o/kit'
import { isEditing } from '@o/stores'
import { Button, PassProps, Popover } from '@o/ui'
import React, { memo } from 'react'
import { useActions } from '../../hooks/useActions'
import { useStores } from '../../hooks/useStores'
import { headerButtonProps } from './OrbitHeader'

export const OrbitHeaderMenu = memo(function OrbitHeaderMenu() {
  const Actions = useActions()
  const { paneManagerStore, locationStore } = useStores()
  const { activePane } = paneManagerStore
  const appSettingsLink = useLocationLink(`apps?itemId=${activePane.id}`)

  return (
    <Popover
      openOnClick
      closeOnClickAway
      closeOnClick
      width={260}
      background
      elevation={5}
      target={<Button {...headerButtonProps} circular iconSize={16} icon="verticalDots" />}
    >
      <OrbitEditAppItem />
      <PassProps iconBefore={true}>
        <ListItem
          {...{
            title: 'Permalink',
            subTitle: `${locationStore.urlString}`,
            icon: 'link',
            onClick: Actions.copyAppLink,
          }}
        />
        <ListItem
          {...{
            title: 'App Settings',
            icon: 'cog',
            onClick: appSettingsLink,
          }}
        />
      </PassProps>
    </Popover>
  )
})

function OrbitEditAppItem() {
  const { paneManagerStore, orbitStore } = useStores()
  const activePaneId = paneManagerStore.activePane.id
  const activeApps = useActiveApps()
  const activeApp = activeApps.find(app => activePaneId === `${app.id}`)
  const show = activeApp && activeApp.identifier === 'custom' && !isEditing
  const Actions = useActions()

  if (!show) {
    return null
  }

  return (
    <ListItem
      title="Edit app"
      icon="code"
      onClick={async () => {
        Actions.tearApp()
        orbitStore.setEditing()
      }}
    />
  )
}
