import { useTheme } from 'gloss'
import { Sidebar, Title } from '@o/ui'
import React from 'react'

import { useStores } from '../../hooks/useStores'

export function OrbitAppSettingsSidebar() {
  const { showAppSettings } = useStores().orbitStore
  const theme = useTheme()
  return (
    <Sidebar
      zIndex={10000001}
      width={300}
      position="right"
      floating
      elevation={5}
      hidden={!showAppSettings}
      background={`${theme.background}`}
      padding
    >
      <Title>hi</Title>
    </Sidebar>
  )
}
