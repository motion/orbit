import { Col, gloss } from '@o/gloss'
import * as React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { TreeItem, TreeItemID, TreeProps } from './Tree'
import { TreeItemsRow } from './TreeItemsRow'

type FlatTreeItem = {
  key: TreeItemID
  element: TreeItem
  level: number
}

type FlatTreeItems = FlatTreeItem[]

export class TreeItems extends React.PureComponent<
  TreeProps,
  {
    flatKeys: TreeItemID[]
    flatTreeItems: FlatTreeItems
    maxDepth: number
  }
> {
  state = {
    flatTreeItems: [],
    flatKeys: [],
  }

  static getDerivedStateFromProps(props, state) {
    if (props.itemsKey && props.itemsKey === state.itemsKey) {
      return null
    }
    const flatTreeItems: FlatTreeItems = []
    const flatKeys = []
    let maxDepth = 0
    function seed(key: TreeItemID, level: number) {
      const element = props.elements[key]
      if (!element) {
        return
      }
      maxDepth = Math.max(maxDepth, level)
      flatTreeItems.push({
        element,
        key,
        level,
      })
      flatKeys.push(key)
      if (element.children != null && element.children.length > 0 && element.expanded) {
        for (const key of element.children) {
          seed(key, level + 1)
        }
      }
    }
    if (props.root != null) {
      seed(props.root, 1)
    }
    return { itemsKey: props.itemsKey, flatTreeItems, flatKeys, maxDepth }
  }

  selectElement = (key: TreeItemID) => {
    this.props.onTreeItemSelected(key)
  }

  onKeyDown = (e: React.KeyboardEvent<any>) => {
    const { selected } = this.props
    if (selected == null) {
      return
    }

    const { props } = this
    const { flatTreeItems, flatKeys } = this.state

    const selectedIndex = flatKeys.indexOf(selected)
    if (selectedIndex < 0) {
      return
    }

    const selectedElement = props.elements[selected]
    if (!selectedElement) {
      return
    }

    if (
      e.key === 'c' &&
      ((e.metaKey && process.platform === 'darwin') || (e.ctrlKey && process.platform !== 'darwin'))
    ) {
      e.preventDefault()
      // clipboard.writeText(selectedElement.name);
      return
    }

    if (e.key === 'ArrowUp') {
      if (selectedIndex === 0 || flatKeys.length === 1) {
        return
      }

      e.preventDefault()
      this.selectElement(flatKeys[selectedIndex - 1])
    }

    if (e.key === 'ArrowDown') {
      if (selectedIndex === flatKeys.length - 1) {
        return
      }

      e.preventDefault()
      this.selectElement(flatKeys[selectedIndex + 1])
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (selectedElement.expanded) {
        // unexpand
        props.onTreeItemExpanded(selected, false)
      } else {
        // jump to parent
        let parentKey
        const targetLevel = flatTreeItems[selectedIndex].level - 1
        for (let i = selectedIndex; i >= 0; i--) {
          const { level } = flatTreeItems[i]
          if (level === targetLevel) {
            parentKey = flatKeys[i]
            break
          }
        }

        if (parentKey) {
          this.selectElement(parentKey)
        }
      }
    }

    if (e.key === 'ArrowRight' && selectedElement.children.length > 0) {
      e.preventDefault()
      if (selectedElement.expanded) {
        // go to first child
        this.selectElement(selectedElement.children[0])
      } else {
        // expand
        props.onTreeItemExpanded(selected, false)
      }
    }
  }

  buildRow = ({ index, style }: { index: number; style: Object }) => {
    const {
      onTreeItemExpanded,
      onTreeItemHovered,
      onTreeItemSelected,
      selected,
      searchResults,
      zebra,
      rowHeight,
    } = this.props
    const { flatTreeItems } = this.state
    const row = flatTreeItems[index]

    let childrenCount = 0
    for (let i = index + 1; i < flatTreeItems.length; i++) {
      const child = flatTreeItems[i]
      if (!child) {
        debugger
      }
      if (child.level <= row.level) {
        break
      } else {
        childrenCount++
      }
    }

    return (
      <TreeItemsRow
        level={row.level}
        id={row.key}
        key={row.key}
        even={zebra && index % 2 === 0}
        onTreeItemExpanded={onTreeItemExpanded}
        onTreeItemHovered={onTreeItemHovered}
        onTreeItemSelected={onTreeItemSelected}
        selected={selected === row.key}
        matchingSearchQuery={
          searchResults && searchResults.matches.has(row.key) ? searchResults.query : null
        }
        element={row.element}
        childrenCount={childrenCount}
        style={style}
        height={rowHeight}
      />
    )
  }

  keyMapper = (index: number): string => {
    return this.state.flatTreeItems[index].key
  }

  render() {
    const items = this.state.flatTreeItems
    return (
      <TreeItemsBox>
        <TreeItemsContainer tabIndex="0" onKeyDown={this.onKeyDown}>
          <AutoSizer>
            {({ width, height }) => (
              <FixedSizeList
                itemCount={items.length}
                itemSize={this.props.rowHeight}
                width={width}
                height={height}
              >
                {this.buildRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </TreeItemsContainer>
      </TreeItemsBox>
    )
  }
}

const TreeItemsContainer = gloss(Col, {
  minHeight: '100%',
  minWidth: '100%',
  overflow: 'auto',
})

const TreeItemsBox = gloss(Col, {
  alignItems: 'flex-start',
  flex: 1,
  overflow: 'auto',
})
