import { isEditing } from '@o/stores'
import { Tab, Tabs } from '@o/ui'
import React, { useCallback } from 'react'
import { useStores } from '../../hooks/useStores'

export function OrbitSettingsToolbar() {
  const { paneManagerStore } = useStores()
  const activePaneKey = paneManagerStore.activePane.type

  const onActive = useCallback(key => {
    paneManagerStore.setActivePane(key)
  }, [])

  if (isEditing) {
    return null
  }

  return (
    <Tabs tabWidth={180} centered sizeRadius={3} active={activePaneKey} onActive={onActive}>
      <Tab id="spaces" icon="layer" label="Spaces" />
      <Tab id="settings" icon="gear" label="Settings" />
    </Tabs>
  )
}
