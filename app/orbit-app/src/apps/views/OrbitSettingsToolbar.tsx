import { Tab, Tabs } from '@mcro/ui'
import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Icon } from '../../views/Icon'

const activePane = observable.box('0')
const tabIconProps = {
  size: 10,
  marginRight: 8,
  color: 'inherit',
}

export const OrbitSettingsToolbar = observer(function OrbitSettingsToolbar() {
  const { paneManagerStore } = useStoresSafe()
  const activePaneKey = activePane.get()
  const panes = [
    {
      key: '0',
      label: (
        <>
          <Icon name="box" {...tabIconProps} />
          Current Space
        </>
      ),
      paneType: 'app-sources',
      onClick: () => {
        paneManagerStore.setActivePaneByType('sources')
      },
    },
    {
      key: '1',
      label: (
        <>
          <Icon name="layer" {...tabIconProps} />
          Spaces
        </>
      ),
      paneType: 'app-spaces',
      onClick: () => {
        paneManagerStore.setActivePaneByType('spaces')
      },
    },
    {
      key: '2',
      label: (
        <>
          <Icon name="gear" {...tabIconProps} />
          Settings
        </>
      ),
      paneType: 'app-settings',
      onClick: () => {
        paneManagerStore.setActivePaneByType('settings')
      },
    },
  ]
  const onActive = React.useCallback(key => {
    if (typeof key === 'string') {
      panes.find(x => x.key === key).onClick()
      activePane.set(key)
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
