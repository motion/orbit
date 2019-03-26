import { SegmentedRow, Tab, Tabs, View } from '@o/ui'
import { isEditing } from '@o/stores'
import React from 'react'
import { useStores } from '../../hooks/useStores'

export function OrbitSettingsToolbar() {
  const { paneManagerStore } = useStores()
  const activePaneKey = paneManagerStore.activePane.type

  const onActive = React.useCallback(key => {
    if (typeof key === 'string') {
      paneManagerStore.setActivePaneByType(key)
    }
  }, [])

  if (isEditing) {
    return null
  }

  return (
    <View margin="auto" width={320}>
      <SegmentedRow borderWidth={1}>
        <Tabs borderRadius={100} active={activePaneKey} onActive={onActive}>
          <Tab key="spaces" icon="layer" label="Spaces" />
          <Tab key="settings" icon="gear" label="Settings" />
        </Tabs>
      </SegmentedRow>
    </View>
  )
}
