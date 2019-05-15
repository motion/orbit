import { DockButton, FloatingCard, List, Tabs, usePosition } from '@o/ui'
import pluralize from 'pluralize'
import React, { memo, useRef, useState } from 'react'

import { orbitStaticApps } from '../../apps/orbitApps'
import { useOm } from '../../om/om'

export const isStaticApp = (identifier: string) => {
  return !!orbitStaticApps.find(x => x.id === identifier)
}

export const useIsOnStaticApp = () => {
  const om = useOm()
  return isStaticApp(om.state.router.appId)
}

export function OrbitDockShare({
  width = 250,
  height = 350,
}: {
  width?: number
  height?: number
  pad?: number
}) {
  const om = useOm()
  const numClipboards = Object.keys(om.state.share).length

  const buttonRef = useRef(null)
  const nodePosition = usePosition({ ref: buttonRef, debounce: 500 })

  const [hovered, setHovered] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(false)
  const showMenu = hovered || hoveredMenu
  const isStatic = useIsOnStaticApp()

  return (
    <>
      <DockButton
        id="share"
        visible={!isStatic}
        icon="clip"
        forwardRef={buttonRef}
        badge={numClipboards}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      {nodePosition && nodePosition.rect && (
        <FloatingCard
          title="Selected"
          subTitle={`Share ${numClipboards} ${pluralize('item', numClipboards)}`}
          defaultWidth={width}
          defaultHeight={height}
          defaultTop={nodePosition.rect.top - height + 20}
          defaultLeft={nodePosition.rect.left - width + 20}
          padding={0}
          zIndex={10000000}
          visible={showMenu}
          onMouseEnter={() => setHoveredMenu(true)}
          onMouseLeave={() => setHoveredMenu(false)}
        >
          <Tabs>
            {Object.keys(om.state.share).map(id => {
              return <Clipboard key={id} id={id} />
            })}
          </Tabs>
        </FloatingCard>
      )}
    </>
  )
}

const Clipboard = memo(({ id }: { id: string }) => {
  const om = useOm()
  const items = om.state.share[id]

  return (
    <List
      selectable="multi"
      itemProps={{ small: true }}
      items={items ? listItemNiceNormalize(items) : null}
    />
  )
})

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
  if (!rows[0]) return []
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
