/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { view } from '@mcro/black'
import { TreeItemID, TreeItem, TreeItemSearchResultSet } from './Tree'
import { Icon } from './Icon'
import { ContextMenu } from './ContextMenu'
import * as React from 'react'
import { Row } from './blocks/Row'
import { Col } from './blocks/Col'
import { Image } from './Image'
import { colors } from './helpers/colors'
import { Text } from './Text'
import { FixedList } from './FixedList'
// import {clipboard} from 'electron';

const ROW_HEIGHT = 23

const TreeItemsRowContainer = view(ContextMenu, {
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 0,
  flexWrap: 'nowrap',
  height: ROW_HEIGHT,
  minWidth: '100%',
  paddingRight: 20,
  position: 'relative',
})

const backgroundColor = props => {
  if (props.selected) {
    return colors.macOSTitleBarIconSelected
  } else if (props.even) {
    return colors.light02
  } else {
    return ''
  }
}

TreeItemsRowContainer.theme = props => {
  return {
    backgroundColor: backgroundColor(props),
    color: props.selected ? colors.white : colors.grapeDark3,
    paddingLeft: (props.level - 1) * 12,
    '& *': {
      color: props.selected ? `${colors.white} !important` : '',
    },
    '&:hover': {
      backgroundColor: props.selected
        ? colors.macOSTitleBarIconSelected
        : '#EBF1FB',
    },
  }
}

const TreeItemsRowDecoration = view(Row, {
  flexShrink: 0,
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginRight: 4,
  position: 'relative',
  width: 16,
  top: -1,
})

const TreeItemsLine = view({
  backgroundColor: colors.light20,
  position: 'absolute',
  right: 3,
  top: ROW_HEIGHT - 3,
  zIndex: 2,
  width: 2,
  borderRadius: '999em',
})

TreeItemsLine.theme = ({ childrenCount }) => ({
  height: childrenCount * ROW_HEIGHT - 4,
})

const DecorationImage = view(Image, {
  height: 12,
  marginRight: 5,
  width: 12,
})

const NoShrinkText = view(Text, {
  flexShrink: 0,
  flexWrap: 'nowrap',
  overflow: 'hidden',
  userSelect: 'none',
  fontWeight: 400,
})

const TreeItemsRowAttributeContainer = view(NoShrinkText, {
  color: colors.dark80,
  fontWeight: 300,
  marginLeft: 5,
})

const TreeItemsRowAttributeKey = view({
  color: colors.tomato,
})

const TreeItemsRowAttributeValue = view({
  color: colors.slateDark3,
})

const HighlightedText = view({
  backgroundColor: '#ffff33',
})

HighlightedText.theme = ({ selected }) => ({
  color: selected ? `${colors.grapeDark3} !important` : 'auto',
})

class PartialHighlight extends React.PureComponent<{
  selected: boolean
  highlighted?: string
  content: string
}> {
  static HighlightedText = HighlightedText

  render() {
    const { highlighted, content, selected } = this.props
    let renderedValue
    if (
      content &&
      highlighted != null &&
      highlighted != '' &&
      content.toLowerCase().includes(highlighted.toLowerCase())
    ) {
      const highlightStart = content
        .toLowerCase()
        .indexOf(highlighted.toLowerCase())
      const highlightEnd = highlightStart + highlighted.length
      const before = content.substring(0, highlightStart)
      const match = content.substring(highlightStart, highlightEnd)
      const after = content.substring(highlightEnd)
      renderedValue = [
        <span>
          {before}
          <PartialHighlight.HighlightedText selected={selected}>
            {match}
          </PartialHighlight.HighlightedText>
          {after}
        </span>,
      ]
    } else {
      renderedValue = <span>{content}</span>
    }
    return renderedValue
  }
}

class TreeItemsRowAttribute extends React.PureComponent<{
  name: string
  value: string
  matchingSearchQuery?: string
  selected: boolean
}> {
  render() {
    const { name, value, matchingSearchQuery, selected } = this.props
    return (
      <TreeItemsRowAttributeContainer code={true}>
        <TreeItemsRowAttributeKey>{name}</TreeItemsRowAttributeKey>
        =
        <TreeItemsRowAttributeValue>
          <PartialHighlight
            content={value}
            highlighted={
              name === 'id' || name === 'addr' ? matchingSearchQuery : ''
            }
            selected={selected}
          />
        </TreeItemsRowAttributeValue>
      </TreeItemsRowAttributeContainer>
    )
  }
}

type FlatTreeItem = {
  key: TreeItemID
  element: TreeItem
  level: number
}

type FlatTreeItems = Array<FlatTreeItem>

type TreeItemsRowProps = {
  id: TreeItemID
  level: number
  selected: boolean
  matchingSearchQuery?: string
  element: TreeItem
  even: boolean
  onTreeItemSelected: (key: TreeItemID) => void
  onTreeItemExpanded: (key: TreeItemID, deep: boolean) => void
  childrenCount: number
  onTreeItemHovered?: (key?: TreeItemID) => void
  style?: Object
}

type TreeItemsRowState = {
  hovered: boolean
}

class TreeItemsRow extends React.PureComponent<
  TreeItemsRowProps,
  TreeItemsRowState
> {
  constructor(props: TreeItemsRowProps, context: Object) {
    super(props, context)
    this.state = { hovered: false }
  }

  interaction: (name: string, data: any) => void

  getContextMenu = (): Array<any> => {
    const { props } = this
    return [
      {
        type: 'separator',
      },
      {
        label: 'Copy',
        click: () => {
          // clipboard.writeText(props.element.name);
        },
      },
      {
        label: props.element.expanded ? 'Collapse' : 'Expand',
        click: () => {
          this.props.onTreeItemExpanded(this.props.id, false)
        },
      },
    ]
  }

  onClick = () => {
    this.props.onTreeItemSelected(this.props.id)
  }

  onDoubleClick = (event: React.MouseEvent<any>) => {
    this.props.onTreeItemExpanded(this.props.id, event.altKey)
  }

  onMouseEnter = () => {
    this.setState({ hovered: true })
    if (this.props.onTreeItemHovered) {
      this.props.onTreeItemHovered(this.props.id)
    }
  }

  onMouseLeave = () => {
    this.setState({ hovered: false })
    if (this.props.onTreeItemHovered) {
      this.props.onTreeItemHovered(null)
    }
  }

  render() {
    const {
      element,
      id,
      level,
      selected,
      style,
      even,
      matchingSearchQuery,
    } = this.props
    const hasChildren = element.children && element.children.length > 0

    let arrow
    if (hasChildren) {
      arrow = (
        <span onClick={this.onDoubleClick} role="button" tabIndex={-1}>
          <Icon
            size={8}
            name={element.expanded ? 'chevron-down' : 'chevron-right'}
            color={selected ? 'white' : colors.light80}
          />
        </span>
      )
    }

    const attributes = element.attributes
      ? element.attributes.map(attr => (
          <TreeItemsRowAttribute
            key={attr.name}
            name={attr.name}
            value={attr.value}
            matchingSearchQuery={matchingSearchQuery}
            selected={selected}
          />
        ))
      : []

    const decoration = (() => {
      switch (element.decoration) {
        case 'litho':
          return <DecorationImage src="icons/litho-logo.png" />
        case 'componentkit':
          return <DecorationImage src="icons/componentkit-logo.png" />
        case 'componentscript':
          return <DecorationImage src="icons/componentscript-logo.png" />
        default:
          return null
      }
    })()

    // when we hover over or select an expanded element with children, we show a line from the
    // bottom of the element to the next sibling
    let line
    const shouldShowLine =
      (selected || this.state.hovered) && hasChildren && element.expanded
    if (shouldShowLine) {
      line = <TreeItemsLine childrenCount={this.props.childrenCount} />
    }

    return (
      <TreeItemsRowContainer
        buildItems={this.getContextMenu}
        key={id}
        level={level}
        selected={selected}
        matchingSearchQuery={matchingSearchQuery}
        even={even}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={style}
      >
        <TreeItemsRowDecoration>
          {line}
          {arrow}
        </TreeItemsRowDecoration>
        <NoShrinkText code={true}>
          {decoration}
          <PartialHighlight
            content={element.name}
            highlighted={matchingSearchQuery}
            selected={selected}
          />
        </NoShrinkText>
        {attributes}
      </TreeItemsRowContainer>
    )
  }
}

const TreeItemsContainer = view(Col, {
  backgroundColor: colors.white,
  minHeight: '100%',
  minWidth: '100%',
  overflow: 'auto',
})

const TreeItemsBox = view(Col, {
  alignItems: 'flex-start',
  flex: 1,
  overflow: 'auto',
})

type TreeItemsProps = {
  root?: TreeItemID
  selected?: TreeItemID
  searchResults?: TreeItemSearchResultSet
  elements: { [key: string]: TreeItem }
  onTreeItemSelected: (key: TreeItemID) => void
  onTreeItemExpanded: (key: TreeItemID, deep: boolean) => void
  onTreeItemHovered?: (key?: TreeItemID) => void
}

type TreeItemsState = {
  flatKeys: Array<TreeItemID>
  flatTreeItems: FlatTreeItems
  maxDepth: number
}

export class TreeItems extends React.PureComponent<
  TreeItemsProps,
  TreeItemsState
> {
  constructor(props: TreeItemsProps, context: Object) {
    super(props, context)
    this.state = {
      flatTreeItems: [],
      flatKeys: [],
      maxDepth: 0,
    }
  }

  componentDidMount() {
    this.setProps(this.props)
  }

  componentWillReceiveProps(nextProps: TreeItemsProps) {
    this.setProps(nextProps)
  }

  setProps(props: TreeItemsProps) {
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
      if (
        element.children != null &&
        element.children.length > 0 &&
        element.expanded
      ) {
        for (const key of element.children) {
          seed(key, level + 1)
        }
      }
    }
    if (props.root != null) {
      seed(props.root, 1)
    }
    this.setState({ flatTreeItems, flatKeys, maxDepth })
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
      ((e.metaKey && process.platform === 'darwin') ||
        (e.ctrlKey && process.platform !== 'darwin'))
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
      // elements,
      onTreeItemExpanded,
      onTreeItemHovered,
      onTreeItemSelected,
      selected,
      searchResults,
    } = this.props
    const { flatTreeItems } = this.state
    const row = flatTreeItems[index]

    let childrenCount = 0
    for (let i = index + 1; i < flatTreeItems.length; i++) {
      const child = flatTreeItems[i]
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
        even={index % 2 === 0}
        onTreeItemExpanded={onTreeItemExpanded}
        onTreeItemHovered={onTreeItemHovered}
        onTreeItemSelected={onTreeItemSelected}
        selected={selected === row.key}
        matchingSearchQuery={
          searchResults && searchResults.matches.has(row.key)
            ? searchResults.query
            : null
        }
        element={row.element}
        // seems like it was unused by sonar
        // elements={elements}
        childrenCount={childrenCount}
        style={style}
      />
    )
  }

  keyMapper = (index: number): string => {
    return this.state.flatTreeItems[index].key
  }

  render() {
    const items = this.state.flatTreeItems
    console.log('items are', items)
    return (
      <TreeItemsBox>
        <TreeItemsContainer tabIndex="0" onKeyDown={this.onKeyDown}>
          <FixedList
            pureData={items}
            keyMapper={this.keyMapper}
            rowCount={items.length}
            rowHeight={ROW_HEIGHT}
            rowRenderer={this.buildRow}
            sideScrollable={true}
          />
        </TreeItemsContainer>
      </TreeItemsBox>
    )
  }
}
