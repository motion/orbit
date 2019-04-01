import { SegmentedRow, Tab, Tabs, View } from '@o/ui'
import React, { useCallback } from 'react'
import { useStores } from '../../hooks/useStores'

export function OrbitSettingsToolbar() {
  const { orbitStore, paneManagerStore } = useStores()
  const activePaneKey = paneManagerStore.activePane.type

  const onActive = useCallback(key => {
    paneManagerStore.setActivePane(key)
  }, [])

  if (orbitStore.isTorn) {
    return null
  }

  return (
    <View margin="auto">
      <SegmentedRow width={180}>
        <Tabs borderRadius={100} active={activePaneKey} onActive={onActive}>
          <Tab id="spaces" icon="layer" label="Spaces" />
          <Tab id="settings" icon="gear" label="Settings" />
        </Tabs>
      </SegmentedRow>
    </View>
  )
}
