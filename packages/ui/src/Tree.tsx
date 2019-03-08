import * as React from 'react'
import { TreeItems } from './TreeItems'

export type TreeItemID = number

export type TreeItemSearchResultSet = {
  query: string
  matches: Set<TreeItemID>
}

export type TreeItemData = {
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

export type TreeItemAttribute = {
  name: string
  value: string
}

export type TreeItem = {
  id: TreeItemID
  name: string
  children: TreeItemID[]
  expanded?: boolean
  attributes?: TreeItemAttribute[]
  data?: TreeItemData
  decoration?: string
  type?: string
}

export type TreeProps = {
  onTreeItemExpanded: (key: TreeItemID, deep: boolean) => void
  onTreeItemSelected: (key: TreeItemID) => void
  onTreeItemHovered?: (key?: TreeItemID) => void
  onValueChanged?: (path: Array<string>, val: any) => void
  selected?: TreeItemID
  searchResults?: TreeItemSearchResultSet
  root?: TreeItemID
  elements: { [key: string]: TreeItem }
  useAppSidebar?: boolean
}

export class Tree extends React.Component<TreeProps> {
  render() {
    const {
      selected,
      elements,
      root,
      onTreeItemExpanded,
      onTreeItemSelected,
      onTreeItemHovered,
      searchResults,
    } = this.props

    return (
      <TreeItems
        onTreeItemExpanded={onTreeItemExpanded}
        onTreeItemSelected={onTreeItemSelected}
        onTreeItemHovered={onTreeItemHovered}
        selected={selected}
        searchResults={searchResults}
        root={root}
        elements={elements}
      />
    )
  }
}
