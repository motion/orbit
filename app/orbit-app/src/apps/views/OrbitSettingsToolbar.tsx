import { useReaction } from '@mcro/black'
import { Icon } from '@mcro/kit'
import { SegmentedRow, Tab, Tabs, View } from '@mcro/ui'
import React, { useState } from 'react'
import { useStores } from '../../hooks/useStores'

const tabIconProps = {
  size: 10,
  marginRight: 8,
  color: 'inherit',
}

const insetShadow = theme => [[0, 0, 0, 0.5, theme.borderColor]]

export function OrbitSettingsToolbar() {
  const { orbitStore, paneManagerStore } = useStores()
  const [activePaneKey, setActivePaneKey] = useState(paneManagerStore.activePane.type)

  log('toolbar')

  useReaction(() => {
    const next = paneManagerStore.activePane.type
    if (next !== activePaneKey) {
      setActivePaneKey(next)
    }
  })

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
      <SegmentedRow borderRadius={200} boxShadow={insetShadow}>
        <Tabs active={activePaneKey} height={20} onActive={onActive}>
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
