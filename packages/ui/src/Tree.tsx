import { gloss, View } from '@o/gloss'
import React from 'react'
import { useNodeSize } from './hooks/useNodeSize'
import { TreeItems } from './TreeItems'

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
  const { ref, width, height } = useNodeSize()
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
