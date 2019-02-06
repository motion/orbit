import { SegmentedRow, Tab, Tabs, View } from '@mcro/ui'
import { useObserver } from 'mobx-react-lite'
import React, { useState } from 'react'
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

export function OrbitSettingsToolbar() {
  const { paneManagerStore } = useStoresSafe()
  const [activePaneKey, setActivePaneKey] = useState(paneManagerStore.activePane.type)
  const [activeSpace] = useActiveSpace()

  useObserver(() => {
    const next = paneManagerStore.activePane.type.replace('app-', '')
    if (next !== activePaneKey) {
      setActivePaneKey(next)
    }
  })

  const onActive = React.useCallback(key => {
    if (typeof key === 'string') {
      paneManagerStore.setActivePaneByType(key)
    }
  }, [])

  return (
    <OrbitToolbar>
      <View margin={[2, 'auto']} maxWidth={500} width="70%" flex={1}>
        <SegmentedRow>
          <Tabs
            // TabComponent={Button}
            // tabProps={{ glint: false, flex: 1 }}
            active={activePaneKey}
            height={28}
            onActive={onActive}
          >
            <Tab
              key="sources"
              label={
                <>
                  {activeSpace && <SpaceIcon space={activeSpace} {...tabIconProps} />}
                  Current Space
                </>
              }
            />
            <Tab
              key="spaces"
              label={
                <>
                  <Icon name="layer" {...tabIconProps} />
                  Spaces
                </>
              }
            />
            <Tab
              key="settings"
              label={
                <>
                  <Icon name="gear" {...tabIconProps} />
                  Settings
                </>
              }
            />
          </Tabs>
        </SegmentedRow>
      </View>
    </OrbitToolbar>
  )
}
