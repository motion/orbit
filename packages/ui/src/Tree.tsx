import { gloss } from '@o/gloss'
import React from 'react'
import { useNodeSize } from './hooks/useNodeSize'
import { TreeItems } from './TreeItems'
import { View } from './View/View'
import { useVisiblity } from './Visibility'

export type TreeProps = {
  root?: TreeItemID
  elements: { [key: string]: TreeItem }
  onTreeItemSelected: (key: TreeItemID) => void
  onTreeItemExpanded: (key: TreeItemID, deep: boolean) => void
  onTreeItemHovered?: (key: TreeItemID) => void
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
    [name: string]: {
      [key: string]:
        | string
        | number
        | boolean
        | {
            __type__: string
            value: any
          }
    }
  }
  decoration?: string
  type?: string
}

export function Tree(props: TreeProps) {
  const visibility = useVisiblity()
  const { ref, width, height } = useNodeSize({
    disable: !visibility,
    throttle: 200,
  })
  return (
    <TreeChrome ref={ref}>
      <TreeItems width={width} height={height} rowHeight={23} zebra {...props} />
    </TreeChrome>
  )
}

const TreeChrome = gloss(View, {
  alignItems: 'flex-start',
  flex: 1,
  maxHeight: '100%',
  maxWidth: '100%',
})
