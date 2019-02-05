import { Tab, Tabs } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Icon } from '../../views/Icon'

const tabIconProps = {
  size: 10,
  marginRight: 8,
  color: 'inherit',
}

export const OrbitSettingsToolbar = observer(function OrbitSettingsToolbar() {
  const { paneManagerStore } = useStoresSafe()
  const activePaneKey = paneManagerStore.activePane.type.replace('app-', '')
  const panes = [
    {
      key: 'sources',
      label: (
        <>
          <Icon name="box" {...tabIconProps} />
          Current Space
        </>
      ),
    },
    {
      key: 'spaces',
      label: (
        <>
          <Icon name="layer" {...tabIconProps} />
          Spaces
        </>
      ),
    },
    {
      key: 'settings',
      label: (
        <>
          <Icon name="gear" {...tabIconProps} />
          Settings
        </>
      ),
    },
  ]
  const onActive = React.useCallback(key => {
    if (typeof key === 'string') {
      paneManagerStore.setActivePaneByType(key)
    }
  }, [])
  return (
    <OrbitToolbar>
      <Tabs active={activePaneKey} height={32} onActive={onActive}>
        {panes.map(pane => (
          <Tab key={pane.key} label={pane.label} />
        ))}
      </Tabs>
    </OrbitToolbar>
  )
})
