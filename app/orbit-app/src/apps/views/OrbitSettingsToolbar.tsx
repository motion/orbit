import { SegmentedRow, Tab, Tabs, View } from '@mcro/ui'
import { useObserver } from 'mobx-react-lite'
import React, { useState } from 'react'
import { getIsTorn } from '../../helpers/getAppHelpers'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStores } from '../../hooks/useStores'
import { Icon } from '../../views/Icon'
import { SpaceIcon } from '../../views/SpaceIcon'

const tabIconProps = {
  size: 10,
  marginRight: 8,
  color: 'inherit',
}

const insetShadow = theme => [[0, 0, 0, 0.5, theme.borderColor]]

export function OrbitSettingsToolbar() {
  const { paneManagerStore } = useStores()
  const [activePaneKey, setActivePaneKey] = useState(paneManagerStore.activePane.type)
  const [activeSpace] = useActiveSpace()
  const isTorn = getIsTorn()

  useObserver(() => {
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

  if (isTorn) {
    return null
  }

  return (
    <View margin="auto" width={420}>
      <SegmentedRow borderRadius={200} boxShadow={insetShadow}>
        <Tabs active={activePaneKey} height={22} onActive={onActive}>
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
  )
}
