import { List } from '@o/kit'
import { FloatingCard } from '@o/ui'
import React from 'react'
import { useStores } from '../../hooks/useStores'

export function OrbitFloatingShareCard({
  width = 200,
  height = 250,
  pad = 20,
}: {
  width?: number
  height?: number
  pad?: number
}) {
  const { spaceStore } = useStores()
  const { currentSelection } = spaceStore
  if (!currentSelection) {
    return null
  }
  return (
    <FloatingCard
      defaultWidth={width}
      defaultHeight={height}
      defaultTop={window.innerHeight - height - pad}
      defaultLeft={window.innerWidth - width - pad}
      title="Share"
      collapsable
    >
      <List items={currentSelection} />
    </FloatingCard>
  )
}
