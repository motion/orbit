import { List } from '@o/kit'
import { Button, FloatingCard, useScreenPosition } from '@o/ui'
import pluralize from 'pluralize'
import React, { useRef, useState } from 'react'
import { useStores } from '../../hooks/useStores'

export function OrbitFloatingShareCard({
  width = 200,
  height = 250,
}: {
  width?: number
  height?: number
  pad?: number
}) {
  const { spaceStore } = useStores()
  const { currentSelection } = spaceStore
  const numItems = (currentSelection && currentSelection.length) || 0
  const buttonRef = useRef(null)
  const nodePosition = useScreenPosition({ ref: buttonRef })
  const [hovered, setHovered] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(false)
  console.log('nodePosition', nodePosition)
  return (
    <>
      <Button
        ref={buttonRef}
        alt="orange"
        circular
        icon="share"
        size={1.5}
        badge={numItems}
        position="fixed"
        bottom={20}
        right={20}
        zIndex={100000000}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        transition="all ease 150ms"
        transform={{
          y: numItems ? 0 : 150,
        }}
      />
      {nodePosition && nodePosition.rect && (
        <FloatingCard
          title="Share"
          subTitle={`${numItems} ${pluralize('item', numItems)}`}
          defaultWidth={width}
          defaultHeight={height}
          defaultTop={nodePosition.rect.top - height + 20}
          defaultLeft={nodePosition.rect.left - width + 20}
          padding={0}
          zIndex={10000000}
          pointerEvents={hovered || hoveredMenu ? 'auto' : 'none'}
          opacity={hovered || hoveredMenu ? 1 : 0}
          transform={{
            y: hovered || hoveredMenu ? 0 : 10,
          }}
          transition="all ease 200ms"
          onMouseEnter={() => setHoveredMenu(true)}
          onMouseLeave={() => setHoveredMenu(false)}
        >
          <List selectable itemProps={{ small: true }} items={currentSelection} />
        </FloatingCard>
      )}
    </>
  )
  // return (

  // )
}
