import { Icon } from '@o/kit'
import { SegmentedRow, Tab, Tabs, View } from '@o/ui'
import React from 'react'
import { useStores } from '../../hooks/useStores'

const tabIconProps = {
  size: 10,
  marginRight: 8,
  color: 'inherit',
}

export function OrbitSettingsToolbar() {
  const { orbitStore, paneManagerStore } = useStores()
  const activePaneKey = paneManagerStore.activePane.type

  const onActive = React.useCallback(key => {
    if (typeof key === 'string') {
      paneManagerStore.setActivePaneByType(key)
    }
  }, [])

  if (orbitStore.isTorn) {
    return null
  }

  return (
    <View margin="auto" width={320}>
      <SegmentedRow borderWidth={1}>
        <Tabs borderRadius={100} active={activePaneKey} height={22} onActive={onActive}>
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
  )
}
