import { gloss } from 'gloss'
import React from 'react'

import { useNodeSize } from './hooks/useNodeSize'
import { useScale } from './Scale'
import { DEFAULT_ROW_HEIGHT } from './tables/types'
import { TreeItems } from './TreeItems'
import { View } from './View/View'
import { useVisibility } from './Visibility'

export type TreeProps = {
  root?: TreeItemID
  elements: { [key: string]: TreeItem }
  onTreeItemSelected: (key: TreeItemID) => void
  onTreeItemExpanded: (key: TreeItemID, deep: boolean) => void
  onTreeItemHovered?: (key: TreeItemID | null) => void
  itemsKey?: string
  selected?: TreeItemID
  searchResults?: {
    query: string
    matches: Set<TreeItemID>
  }
  zebra?: boolean
  rowHeight?: number
}

export type TreeItemID = number

export type TreeItem = {
  id: TreeItemID
  name: string
  children: TreeItemID[]
  expanded?: boolean
  attributes?: {
    name: string
    value: string
  }[]
  data?: {
    [name: string]:
      | string
      | number
      | boolean
      | {
          __type__: string
          value: any
        }
  }
  decoration?: string
  type?: string
}

export function Tree(props: TreeProps) {
  const visibility = useVisibility()
  const { ref, width, height } = useNodeSize({
    disable: !visibility,
    throttle: 200,
  })
  const scale = useScale()
  return (
    <TreeChrome ref={ref}>
      <TreeItems
        width={width}
        height={height}
        rowHeight={scale * DEFAULT_ROW_HEIGHT}
        zebra
        {...props}
      />
    </TreeChrome>
  )
}

const TreeChrome = gloss(View, {
  alignItems: 'flex-start',
  flex: 1,
  maxHeight: '100%',
  maxWidth: '100%',
})
