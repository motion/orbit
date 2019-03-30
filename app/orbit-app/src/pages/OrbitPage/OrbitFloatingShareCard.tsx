import { List } from '@o/kit'
import { FloatingCard } from '@o/ui'
import React from 'react'
import { useStores } from '../../hooks/useStores'

export function OrbitFloatingShareCard() {
  const { spaceStore } = useStores()
  const { currentSelection } = spaceStore
  console.log('currentSelection', currentSelection)
  if (currentSelection) {
    return null
  }
  return (
    <FloatingCard
      width={180}
      height={200}
      top={window.innerHeight - 220}
      left={window.innerWidth - 200}
      title="Share"
    >
      <List items={currentSelection} />
    </FloatingCard>
  )
}
