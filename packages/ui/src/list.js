// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import ListItem from './listItem'
import { List as VirtualList } from 'react-virtualized'
import parentSize from '~/helpers/parentSize'
import type { ItemProps } from './listItem'
import Surface from './surface'
import type { Color } from '@mcro/gloss'

const idFn = _ => _
const SEPARATOR_HEIGHT = 25

export type Props = {
  defaultSelected?: number,
  borderColor?: Color,
  borderRadius?: number,
  children?: React.Element<any>,
  controlled?: boolean,
  flex?: boolean | number,
  getItem?: Function,
  getRef?: Function,
  height?: number,
  horizontal?: boolean,
  itemProps?: Object,
  items?: Array<ItemProps | React.Element<any>>,
  loading?: boolean,
  onHighlight: Function,
  onItemMount?: Function,
  onSelect: Function,
  parentSize?: Object,
  rowHeight?: number,
  scrollable?: boolean,
  segmented?: boolean,
  size?: number,
  style?: Object,
  width?: number,
  groupKey?: string,
  selected?: number,
  separatorHeight: number,
}

@parentSize('virtualized')
@view.ui
class List extends React.PureComponent<Props, { selected: number }> {
  static Item = ListItem

  static defaultProps = {
    getItem: idFn,
    onSelect: idFn,
    onHighlight: idFn,
    separatorHeight: SEPARATOR_HEIGHT,
  }

  state = {
    selected: -1,
  }

  // for tracking list resizing for virtual lists
  totalItems = null
  itemRefs: Array<HTMLElement> = []
  lastDidReceivePropsDate: ?number

  componentWillMount = () => {
    this.totalItems = this.getTotalItems(this.props)
    if (typeof this.props.defaultSelected !== 'undefined') {
      this.setState({ selected: this.props.defaultSelected })
    }
  }

  componentDidUpdate() {
    if (this.state.selected > -1) {
      if (this.itemRefs[this.state.selected]) {
        true // was a console log
      }
    }
  }

  componentWillReceiveProps = (nextProps: Props) => {
    if (typeof nextProps.selected !== 'undefined') {
      this.lastDidReceivePropsDate = Date.now()
      if (nextProps.selected !== this.state.selected) {
        this.setState({ selected: nextProps.selected })
      }
    }

    const totalItems = this.getTotalItems(nextProps)
    if (totalItems !== this.totalItems) {
      this.totalItems = totalItems
      // resize to fit
      const { parentHeight } = this.props
      if (
        parentHeight &&
        nextProps.parentHeight &&
        (nextProps.parentSize.height !== parentHeight.height ||
          nextProps.parentHeight.width !== parentHeight.width)
      ) {
        nextProps.parentSize.measure()
      }
    }
  }

  gatherRefs = index => ref => {
    if (ref) {
      this.itemRefs[index] = ref
    }
  }

  getTotalItems = props =>
    props.items ? props.items.length : React.Children.count(props.children)

  isSelected = fn => (...args) =>
    typeof this.state.selected === 'number' ? fn(...args) : null

  actions = {
    down: this.isSelected(() => {
      this.highlightItem(cur => Math.min(this.totalItems, cur + 1))
    }),
    cmdEnter: this.isSelected(() => {
      this.props.onCmdEnter && this.props.onCmdEnter(this.selected)
    }),
    up: this.isSelected(() => {
      this.highlightItem(cur => Math.max(0, cur - 1))
    }),
    enter: this.isSelected(() => {
      this.highlightItem(() => this.state.selected)
    }),
  }

  totalItems = () => {
    // TODO could check children length?
    return this.props.items.length
  }

  // wrap weird signature
  select = (selector: number | Function) => {
    if (typeof selector === 'number') {
      this.highlightItem(() => selector)
    } else if (typeof selector === 'function') {
      this.highlightItem(() => this.props.items.findIndex(selector))
    }
  }

  highlightItem = (setter: ?() => number, cb?: Function) => {
    const selected = setter(this.state.selected)
    this.lastSelectionDate = Date.now()
    this.setState({ selected }, () => {
      this.props.onSelect(this.selected, selected)
      if (cb) cb()
    })
    return selected
  }

  get selected() {
    const { selected } = this.state
    if (selected === null) {
      return null
    } else {
      return this.props.items[selected]
    }
  }

  clearSelected = () => {
    this.highlightItem(() => null)
  }

  get showInternalSelection() {
    if (!this.props.selected) {
      return true
    }
    return this.lastSelectionDate > this.lastDidReceivePropsDate
  }

  render() {
    const {
      borderColor,
      borderRadius,
      children,
      controlled,
      getItem,
      height: height_,
      itemProps,
      items,
      loading,
      onHighlight,
      onItemMount,
      onSelect,
      virtualized,
      scrollable,
      segmented,
      size,
      style,
      width: userWidth,
      separatorHeight,
      isSelected,
      groupKey,
      parentSize,
      defaultSelected,
      ...props
    } = this.props

    if (!items && !children) {
      return null
    }

    let height = height_
    let width = userWidth
    let rowHeight
    let dynamicRowHeight = false

    if (virtualized && !parentSize) {
      return null
    }

    if (virtualized && parentSize) {
      height = parentSize.height || height_ || 0
      width = parentSize.width || userWidth || 0
      rowHeight = virtualized ? virtualized.rowHeight : undefined
      dynamicRowHeight = typeof virtualized.rowHeight === 'function'
    }

    const passThroughProps = {
      height: rowHeight,
      onItemMount,
      size,
      borderRadius,
      borderColor,
      ...itemProps,
    }

    const total = items ? items.length : React.Children.count(children)

    const getItemProps = (index, rowProps, isListItem) => {
      const positionProps = {
        segmented,
        isFirstElement: index === 0,
        isLastElement: index === total - 1,
      }
      const props = {
        key: index,
        ...rowProps,
        ...(isListItem ? passThroughProps : itemProps),
        ...(isListItem ? positionProps : null),
        ref: this.gatherRefs(index),
      }
      if (onSelect || controlled) {
        const ogClick = props.onClick
        props.onClick = e => {
          this.highlightItem(() => index)
          if (ogClick) {
            ogClick.call(this, e)
          }
        }
      }
      if (controlled) {
        // set highlight if necessary
        props.highlight = this.showInternalSelection
          ? index === this.state.selected
          : isSelected && isSelected(items[index], index)
      } else {
        if (this.props.selected === index) {
          props.highlight = true
        }
        // if they provide a prop-based isSelected, still track the right index internally
        if (props.highlight && this.state.selected !== index) {
          this.state.selected = index
        }
      }
      return props
    }

    const getListItem = (cur, index) => rowProps => {
      const item = getItem(cur, index)
      if (item === null) {
        return null
      }
      if (React.isValidElement(item)) {
        return React.cloneElement(item, getItemProps(index, rowProps))
      }
      // pass object to ListItem
      return (
        <ListItem
          key={item.key || cur.id || index}
          {...getItemProps(index, rowProps, true)}
          {...item}
        />
      )
    }

    // allow passing of rowProps by wrapping each in function
    let chillen = children
      ? React.Children.map(children, (item, index) => rowProps =>
          item
            ? React.cloneElement(
                item,
                getItemProps(index, rowProps, item.type.isListItem)
              )
            : null
        )
      : items.map(getListItem)

    // if no need, just get them right away
    if (!virtualized) {
      chillen = chillen.map(child => child())
    }

    const groupOffsets = {}
    let totalGroups = 0

    if (groupKey && items) {
      const groups = []
      let lastGroup = null

      items.forEach((item, index) => {
        if (lastGroup !== item[groupKey]) {
          lastGroup = item[groupKey]
          if (lastGroup) {
            const groupIndex = index + totalGroups
            groupOffsets[groupIndex] = true
            // add groups.length because we make list bigger as we add separators
            groups.push({ index: groupIndex, name: lastGroup })
            totalGroups++
          }
        }
      })

      for (const { index, name } of groups) {
        let child
        if (virtualized) {
          child = (extraProps: Object) => (
            <separator {...extraProps}>{name}</separator>
          )
        } else {
          child = <separator key={Math.random()}>{name}</separator>
        }
        chillen.splice(index, 0, child)
      }
    }

    const getRowHeight = ({ index }) => {
      if (groupOffsets[index]) {
        return separatorHeight
      }
      if (dynamicRowHeight) {
        return virtualized.rowHeight(index)
      }
      return virtualized.rowHeight
    }

    const inner = (
      <Surface
        tagName="list"
        align="stretch"
        height={height}
        width={width}
        style={{
          height: '100%',
          overflowY: scrollable ? 'scroll' : 'hidden',
          overflowX: 'visible',
          ...style,
        }}
        borderRadius={borderRadius}
        {...props}
      >
        {!loading &&
        virtualized && (
          <VirtualList
            height={height}
            width={width}
            overscanRowCount={3}
            rowCount={total + totalGroups}
            rowRenderer={({ index, key, style }) =>
              chillen[index]({ key, style })}
            {...virtualized}
            rowHeight={getRowHeight}
          />
        )}
        {!virtualized && chillen}
      </Surface>
    )
    if (!controlled) {
      return inner
    }
    return (
      <HotKeys
        handlers={this.actions}
        style={{
          height: '100%',
          flexDirection: 'inherit',
          flexGrow: 'inherit',
        }}
      >
        {inner}
      </HotKeys>
    )
  }

  static style = {
    separator: {
      padding: [0, 10],
      height: SEPARATOR_HEIGHT,
      justifyContent: 'center',
      background: [0, 0, 0, 0.05],
    },
  }
}

export default List
