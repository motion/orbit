// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import ListItem from './listItem'
import { List as VirtualList } from 'react-virtualized'
import parentSize from '~/helpers/parentSize'
import type { ItemProps } from './listItem'
import Surface from './surface'

const idFn = _ => _
const SEPARATOR_HEIGHT = 25

export type Props = {
  defaultSelected?: number,
  children?: React.Element<any>,
  controlled?: boolean,
  flex?: boolean | number,
  getItem?: Function,
  getRef?: Function,
  height?: number,
  horizontal?: boolean,
  itemProps?: Object,
  items?: Array<ItemProps | React.Element<any>>,
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
    this.updateChildren(this.props)
    this.totalItems = this.getTotalItems(this.props)
    if (typeof this.props.defaultSelected !== 'undefined') {
      this.setState({ selected: this.props.defaultSelected })
    }
  }

  componentWillReceiveProps = (nextProps: Props) => {
    const { selected } = nextProps

    if (typeof selected !== 'undefined') {
      this.lastDidReceivePropsDate = Date.now()
      if (selected !== this.state.selected) {
        this.setState({ selected })
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

  clearSelected = () => {
    this.highlightItem(() => null)
  }

  get selected() {
    const { selected } = this.state
    if (selected === null) {
      return null
    } else {
      return this.props.items[selected]
    }
  }

  get showInternalSelection() {
    if (!this.props.selected) {
      return true
    }
    if (this.props.isSelected) {
      return false
    }
    return this.lastSelectionDate > this.lastDidReceivePropsDate
  }

  get total() {
    return this.props.items
      ? this.props.items.length
      : React.Children.count(this.props.children)
  }

  getRow = ({ index, key, style }) => {
    return this.children[index]({ key, style })
  }

  getRowHeight = ({ index }) => {
    const { groupedIndex } = this
    const { separatorHeight, virtualized } = this.props
    if (groupedIndex[index] === true) {
      return separatorHeight
    }
    const dynamicRowHeight = typeof virtualized.rowHeight === 'function'
    if (dynamicRowHeight) {
      return virtualized.rowHeight(groupedIndex[index])
    }
    return virtualized.rowHeight
  }

  getItemProps(index, rowProps, isListItem) {
    const {
      parentSize,
      virtualized,
      onItemMount,
      size,
      onSelect,
      controlled,
      itemProps,
      isSelected,
      items,
      segmented,
    } = this.props
    const { total } = this
    let rowHeight
    if (virtualized && parentSize) {
      rowHeight = virtualized ? virtualized.rowHeight : undefined
    }
    const passThroughProps = {
      height: rowHeight,
      onItemMount,
      size,
      ...itemProps,
    }
    const getRef = this.gatherRefs(index)
    const props = {
      ...rowProps,
      ...(isListItem ? passThroughProps : itemProps),
      ...(isListItem
        ? {
            segmented,
            isFirstElement: index === 0,
            isLastElement: index === total - 1,
          }
        : null),
      ...(isListItem ? { getRef } : { ref: getRef }),
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
    if (controlled && this.showInternalSelection) {
      // set highlight if necessary
      props.highlight = index === this.state.selected
    } else {
      if (this.props.selected === index) {
        props.highlight = true
      } else if (isSelected) {
        props.highlight = isSelected(index)
      }
      // if they provide a prop-based isSelected, still track the right index internally
      if (props.highlight && this.state.selected !== index) {
        this.state.selected = index
      }
    }
    return props
  }

  // for items={}
  getListItem = (cur, index) => rowProps => {
    const item = this.props.getItem(cur, index)
    if (item === null) {
      return null
    }
    if (React.isValidElement(item)) {
      return React.cloneElement(item, this.getItemProps(index, rowProps))
    }
    // pass object to ListItem
    return (
      <ListItem
        key={item.key || cur.id || index}
        {...this.getItemProps(index, rowProps, true)}
        {...item}
      />
    )
  }

  // for children={}
  getListChildren = children =>
    React.Children.map(children, (item, index) => rowProps =>
      item
        ? React.cloneElement(
            item,
            this.getItemProps(index, rowProps, item.type.isListItem)
          )
        : null
    )

  // mutative which is odd
  // sets:
  //   this.children
  //   this.groupedIndex
  //   this.realIndex
  //   this.totalGroups
  updateChildren({
    children: children_,
    items,
    virtualized,
    groupKey,
    parentSize,
  }) {
    if (!items && !children_) {
      return null
    }
    if (virtualized && !parentSize) {
      return null
    }
    // allow passing of rowProps by wrapping each in function
    let children = children_
      ? this.getListChildren(children_)
      : items.map(this.getListItem)

    // if no need, just get them right away
    if (!virtualized) {
      children = children.map(child => child())
    }

    // grouping logic
    this.groupedIndex = []
    this.realIndex = []
    this.totalGroups = 0

    if (groupKey && items) {
      const groups = []
      let lastGroup = null

      items.forEach((item, itemIndex) => {
        const index = itemIndex + this.totalGroups
        this.realIndex[itemIndex] = index
        if (lastGroup !== item[groupKey]) {
          lastGroup = item[groupKey]
          // if is separator
          if (lastGroup) {
            groups.push({ index, name: lastGroup })
            this.totalGroups++
            this.groupedIndex[index] = true // separator
            this.groupedIndex[index + 1] = itemIndex // next
            return
          }
        }
        this.groupedIndex[index] = itemIndex
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
        children.splice(index, 0, child)
      }
    }

    this.children = children
  }

  render() {
    const { children } = this
    if (!children) {
      return null
    }
    let height = this.props.height
    let width = this.props.width
    const {
      virtualized,
      parentSize,
      scrollable,
      style,
      attach,
      controlled,
    } = this.props

    if (virtualized && parentSize) {
      height = parentSize.height || height || 0
      width = parentSize.width || width || 0
    }
    const { total, totalGroups, realIndex } = this
    const inner = (
      <Surface
        tagName="list"
        align="stretch"
        height={height}
        width={width}
        style={{
          height: '100%',
          overflowX: 'visible',
          overflowY: scrollable ? 'scroll' : 'auto',
          ...style,
        }}
        {...attach}
      >
        {virtualized && (
          <VirtualList
            height={height}
            width={width}
            overscanRowCount={3}
            scrollToIndex={realIndex[this.state.selected]}
            rowCount={total + totalGroups}
            rowRenderer={this.getRow}
            {...virtualized}
            rowHeight={this.getRowHeight}
          />
        )}
        {!virtualized && children}
      </Surface>
    )
    if (!controlled) {
      return inner
    }
    return (
      <HotKeys $keys handlers={this.actions}>
        {inner}
      </HotKeys>
    )
  }

  static style = {
    keys: {
      height: '100%',
      flexDirection: 'inherit',
      flexGrow: 'inherit',
    },
    separator: {
      padding: [0, 10],
      height: SEPARATOR_HEIGHT,
      justifyContent: 'center',
      background: [0, 0, 0, 0.05],
    },
  }
}

export default List
