import React from 'react'
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
  return <TreeItems rowHeight={23} {...props} />
}
