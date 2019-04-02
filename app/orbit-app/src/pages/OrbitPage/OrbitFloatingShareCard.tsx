import { Button } from '@o/ui'
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
  const numItems = currentSelection.length

  return (
    <Button
      alt="orange"
      circular
      size={2}
      position="fixed"
      bottom={20}
      right={20}
      zIndex={100000000}
    >
      {numItems}
    </Button>
  )
  // return (
  //   <FloatingCard
  //     defaultWidth={width}
  //     defaultHeight={height}
  //     defaultTop={window.innerHeight - height - pad}
  //     defaultLeft={window.innerWidth - width - pad}
  //     title="Share"
  //     subTitle={`${numItems} ${pluralize('item', numItems)}`}
  //     collapsable
  //     padding={0}
  //   >
  //     <List selectable itemProps={{ small: true }} items={currentSelection} />
  //   </FloatingCard>
  // )
}
