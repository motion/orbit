import { List } from '@o/kit'
import { FloatingCard, useScreenPosition } from '@o/ui'
import pluralize from 'pluralize'
import React, { useRef, useState } from 'react'
import { orbitStaticApps } from '../../apps/orbitApps'
import { useStores } from '../../hooks/useStores'
import { DockButton } from './Dock'

export function OrbitFloatingShareCard({
  width = 250,
  height = 350,
  index,
}: {
  width?: number
  height?: number
  pad?: number
  index: number
}) {
  const { spaceStore, paneManagerStore } = useStores()
  const { currentSelection } = spaceStore
  const numItems = (currentSelection && currentSelection.length) || 0
  const buttonRef = useRef(null)
  const nodePosition = useScreenPosition({ ref: buttonRef, debounce: 500 })
  const [hovered, setHovered] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(false)
  const isStaticApp = !!orbitStaticApps.find(x => x.id === paneManagerStore.activePane.type)
  const showMenu = hovered || hoveredMenu
  const showButton = !isStaticApp && !!numItems
  return (
    <>
      <DockButton
        index={index}
        forwardRef={buttonRef}
        badge={numItems}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        opacity={showButton ? 1 : 0}
        transform={{
          y: showButton ? 0 : 150,
        }}
      />
      {nodePosition && nodePosition.rect && (
        <FloatingCard
          title="Selected"
          subTitle={`Share ${numItems} ${pluralize('item', numItems)}`}
          defaultWidth={width}
          defaultHeight={height}
          defaultTop={nodePosition.rect.top - height + 20}
          defaultLeft={nodePosition.rect.left - width + 20}
          padding={0}
          zIndex={10000000}
          pointerEvents={showMenu ? 'auto' : 'none'}
          opacity={showMenu ? 1 : 0}
          transform={{
            y: showMenu ? 0 : 10,
          }}
          transition="all ease 200ms"
          onMouseEnter={() => setHoveredMenu(true)}
          onMouseLeave={() => setHoveredMenu(false)}
        >
          <List
            selectable="multi"
            itemProps={{ small: true }}
            items={currentSelection ? listItemNiceNormalize(currentSelection) : null}
          />
        </FloatingCard>
      )}
    </>
  )
}

const subTitleAttrs = ['subTitle', 'subtitle', 'email', 'address', 'phone', 'type', 'account']
const titleAttrs = ['title', 'name', 'email', ...subTitleAttrs]
const findAttr = (attrs, row, avoid = '') => {
  for (const attr of attrs) {
    if (typeof row[attr] === 'string' && row[attr] !== avoid) {
      return row[attr]
    }
  }
}

function listItemNiceNormalize(rows: any[]) {
  if (!rows.length) return rows
  if (rows[0].title) return rows
  return rows.map(rawRow => {
    const row = rawRow.values || rawRow
    const id = row.id || row.key || row.uid
    const title = findAttr(titleAttrs, row) || 'No Title'
    const subTitle = findAttr(titleAttrs, row, title)
    return {
      id,
      title,
      subTitle: subTitle && id ? `${id} ${subTitle}` : subTitle,
    }
  })
}
