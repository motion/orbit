import { Box, gloss, ThemeFn } from 'gloss'
import * as React from 'react'

import { colors } from './helpers/colors'
import { Icon } from './Icon'
import { Image } from './Image'
import { Text, TextProps } from './text/Text'
import { TreeItem, TreeItemID } from './Tree'

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
type TreeItemsRowProps = {
  id: TreeItemID
  level: number
  selected: boolean
  matchingSearchQuery?: string
  element: TreeItem
  even: boolean
  onTreeItemSelected: (key: TreeItemID) => void
  onTreeItemExpanded: (key: TreeItemID, deep: boolean) => void
  onTreeItemHovered?: (key: TreeItemID | null) => void
  childrenCount: number
  style?: Object
  height: number | string
}

export class TreeItemsRow extends React.PureComponent<TreeItemsRowProps> {
  state = { hovered: false }

  getContextMenu = (): any[] => {
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
    const { height, element, id, level, selected, style, even, matchingSearchQuery } = this.props
    const hasChildren = element.children && element.children.length > 0

    let arrow
    if (hasChildren) {
      arrow = (
        <span onClick={this.onDoubleClick} role="button" tabIndex={-1}>
          <Icon
            size={10}
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

    // TODO make this our icon
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
    const shouldShowLine = (selected || this.state.hovered) && hasChildren && element.expanded
    if (shouldShowLine) {
      line = <TreeItemsLine height={height} childrenCount={this.props.childrenCount} />
    }

    return (
      <TreeItemsRowContainer
        // buildItems={this.getContextMenu}
        // matchingSearchQuery={matchingSearchQuery}
        even={even}
        key={id}
        level={level}
        selected={selected}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={style}
        height={height}
      >
        <TreeItemsRowDecoration>
          {line}
          {arrow}
        </TreeItemsRowDecoration>
        <NoShrinkText>
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

const backgroundTheme: ThemeFn = props => {
  let background
  if (props.selected) {
    background = props.backgroundHighlight || props.backgroundActive || props.background
  } else if (props.even) {
    background = props.backgroundZebra
  }
  return { background }
}

const TreeItemsRowContainer = gloss<{ selected?: boolean; level?: number; even?: boolean }>(Box, {
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 0,
  flexWrap: 'nowrap',
  minWidth: '100%',
  paddingRight: 20,
  position: 'relative',
}).theme(backgroundTheme, props => {
  return {
    height: `calc(${props.height}px * var(--scale))`,
    color: props.selected ? colors.white : colors.grapeDark3,
    paddingLeft: (props.level - 1) * 12,
    '& *': {
      color: props.selected ? `${colors.white} !important` : '',
    },
    hoverStyle: {
      background: props.selected ? props.backgroundHighlightHover : props.backgroundHover,
    },
  }
})

class PartialHighlight extends React.PureComponent<{
  selected: boolean
  highlighted?: string
  content: string
}> {
  render() {
    const { highlighted, content, selected } = this.props
    let renderedValue
    if (
      content &&
      highlighted != null &&
      highlighted != '' &&
      content.toLowerCase().includes(highlighted.toLowerCase())
    ) {
      const highlightStart = content.toLowerCase().indexOf(highlighted.toLowerCase())
      const highlightEnd = highlightStart + highlighted.length
      const before = content.substring(0, highlightStart)
      const match = content.substring(highlightStart, highlightEnd)
      const after = content.substring(highlightEnd)
      renderedValue = (
        <span>
          {before}
          <HighlightedText selected={selected}>{match}</HighlightedText>
          {after}
        </span>
      )
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
      <TreeItemsRowAttributeContainer>
        <TreeItemsRowAttributeKey>{name}</TreeItemsRowAttributeKey>=
        <TreeItemsRowAttributeValue>
          <PartialHighlight
            content={value}
            highlighted={name === 'id' || name === 'addr' ? matchingSearchQuery : ''}
            selected={selected}
          />
        </TreeItemsRowAttributeValue>
      </TreeItemsRowAttributeContainer>
    )
  }
}

const TreeItemsRowDecoration = gloss(Box, {
  flexDirection: 'row',
  flexShrink: 0,
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginRight: 4,
  position: 'relative',
  width: 16,
  top: -1,
})

const TreeItemsLine = gloss<{ height: number | string; childrenCount: number }>(Box, {
  position: 'absolute',
  right: 3,
  zIndex: 2,
  width: 2,
  borderRadius: '999em',
}).theme(props => ({
  top: 0,
  height: `calc(${props.height}px * var(--scale))`,
  // top: props.height - 3,
  // height: props.childrenCount * props.height - 4,
  background: props.borderColor,
}))

const DecorationImage = gloss(Image, {
  height: 12,
  marginRight: 5,
  width: 12,
})

const NoShrinkText = gloss<TextProps>(Text, {
  flexShrink: 0,
  flexWrap: 'nowrap',
  overflow: 'hidden',
  userSelect: 'none',
  fontWeight: 400,
})

const TreeItemsRowAttributeContainer = gloss(NoShrinkText, {
  fontWeight: 300,
  marginLeft: 5,
})

const TreeItemsRowAttributeKey = gloss(Box, {
  color: 'red',
})

const TreeItemsRowAttributeValue = gloss(Box, {
  color: 'yellow',
})

const HighlightedText = gloss<{ selected?: boolean }>(Box).theme(props => ({
  backgroundColor: props.backgroundZebra,
  color: props.selected ? `${props.colorHighlight.toCSS()} !important` : 'auto',
}))
