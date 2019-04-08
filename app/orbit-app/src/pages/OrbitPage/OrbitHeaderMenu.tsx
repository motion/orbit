import { List, useLocationLink, useStores } from '@o/kit'
import { Button, Popover } from '@o/ui'
import React, { memo } from 'react'
import { useActions } from '../../hooks/useActions'
import { headerButtonProps } from './OrbitHeader'

export const OrbitHeaderMenu = memo(function OrbitHeaderMenu() {
  const Actions = useActions()
  const { paneManagerStore } = useStores()
  const { activePane } = paneManagerStore
  const appSettingsLink = useLocationLink(`apps?itemId=${activePane.id}`)

  return (
    <Popover
      openOnClick
      closeOnClickAway
      closeOnClick
      width={300}
      background
      elevation={7}
      target={
        <Button
          {...headerButtonProps}
          circular
          iconSize={16}
          icon="verticalDots"
          tooltip="App Settings"
          onClick={appSettingsLink}
        />
      }
    >
      <List
        items={[
          {
            title: 'Permalink',
            icon: 'link',
            onClick: Actions.copyAppLink,
          },
        ]}
      />
    </Popover>
  )
})
