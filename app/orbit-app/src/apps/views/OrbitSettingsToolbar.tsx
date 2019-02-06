import { SegmentedRow, Tab, Tabs, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { OrbitToolbar } from '../../components/OrbitToolbar'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Icon } from '../../views/Icon'
import { SpaceIcon } from '../../views/SpaceIcon'

const tabIconProps = {
  size: 10,
  marginRight: 8,
  color: 'inherit',
}

export const OrbitSettingsToolbar = observer(function OrbitSettingsToolbar() {
  const { paneManagerStore } = useStoresSafe()
  const activePaneKey = paneManagerStore.activePane.type.replace('app-', '')
  const [activeSpace] = useActiveSpace()

  const panes = [
    {
      key: 'sources',
      label: (
        <>
          {activeSpace && <SpaceIcon space={activeSpace} {...tabIconProps} />}
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
      <div>
        <SegmentedRow>
          <div />
        </SegmentedRow>
      </div>
      <View margin={[2, 'auto']} maxWidth={600} width="70%" flex={1}>
        <Tabs active={activePaneKey} height={28} onActive={onActive}>
          {panes.map(pane => (
            <Tab key={pane.key} label={pane.label} />
          ))}
        </Tabs>
      </View>
    </OrbitToolbar>
  )
})
