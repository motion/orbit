import { Sidebar, Title } from '@o/ui'
import React from 'react'
import { useStores } from '../../hooks/useStores'

export function OrbitAppSettingsSidebar() {
  const { showAppSettings } = useStores().orbitStore
  return (
    <Sidebar
      zIndex={10000000}
      width={300}
      position="right"
      floating
      elevation={5}
      hidden={!showAppSettings}
    >
      <Title>hi</Title>
    </Sidebar>
  )
}
