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
class List extends React.Component<Props, { selected: number }> {
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

  componentWillMount() {
    this.totalItems = this.getTotalItems(this.props)

    if (typeof this.props.defaultSelected !== 'undefined') {
      this.setState({ selected: this.props.defaultSelected })
    }

    if (this.props.getRef) {
      this.props.getRef(this)
    }
  }

  // willUpdate only runs when PureComponent has new props
  componentWillUpdate(nextProps: Props) {
    const { selected } = nextProps

    if (typeof selected !== 'undefined') {
      this.lastDidReceivePropsDate = Date.now()
      if (selected !== this.state.selected) {
        this.setState({ selected })
      }
    }

    const totalItems = this.getTotalItems(nextProps)
    const hasNewItems = totalItems !== this.totalItems
    if (hasNewItems) {
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

    if (
      (typeof selected === 'number' && this.state.selected !== selected) ||
      hasNewItems ||
      !this.childrenVersion
    ) {
      this.props = nextProps
      this.updateChildren()
    }
  }

  scrollToRow = (index: number) => {
    if (this.virtualListRef) {
      this.virtualListRef.scrollToRow(index)
    }
  }

  measure = () => {
    if (this.virtualListRef) {
      this.virtualListRef.recomputeRowHeights(0)
    } else {
      console.log('no virtual list')
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

  // wrap weird signature
  select = (selector: number | Function) => {
    if (typeof selector === 'number') {
      this.highlightItem(() => selector)
    } else if (typeof selector === 'function') {
      this.highlightItem(() => this.props.items.findIndex(selector))
    }
  }

  highlightItem(setter: ?() => number, cb?: Function) {
    const selected = setter(this.state.selected)
    this.lastSelectionDate = Date.now()
    // only setstate if controlled
    if (this.props.controlled) {
      this.setState({ selected }, () => {
        this.props.onSelect(this.selected, selected)
        if (cb) cb()
      })
    } else {
      this.state.selected = selected
      this.props.onSelect(this.selected, selected)
      if (cb) cb()
    }
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

  get showInternalSelection() {
    if (!this.props.selected) {
      return true
    }
    if (this.props.isSelected) {
      return false
    }
    return this.lastSelectionDate > this.lastDidReceivePropsDate
  }

  getRow = ({ index, key, style }) => {
    if (!this.children || !this.children[index]) {
      console.log('no child', index, this)
      return null
    }
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
      onItemMount,
      size,
      onSelect,
      controlled,
      itemProps,
      isSelected,
      selected,
      segmented,
    } = this.props
    const getRef = this.gatherRefs(index)
    const props = {
      ...rowProps,
      ...(isListItem
        ? {
            onItemMount,
            size,
            getRef,
            segmented,
            isFirstElement: index === 0,
            isLastElement: index === this.totalItems - 1,
          }
        : {
            ref: getRef,
          }),
      ...itemProps,
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
      if (selected === index) {
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
  // curried so we can avoid work in virtualized contexts
  getListItem = (cur, index) => rowProps => {
    const item = this.props.getItem(cur, index)
    if (!item) {
      return null
    }
    if (React.isValidElement(item)) {
      return React.cloneElement(
        item,
        this.getItemProps(index, rowProps, item.type.isListItem)
      )
    }
    // pass object to ListItem
    return (
      <ListItem
        {...this.getItemProps(index, rowProps, true)}
        {...item}
        key={item.key || item.id || index}
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
  updateChildren() {
    const { props } = this
    const {
      children: children_,
      items,
      virtualized,
      groupKey,
      parentSize,
    } = props
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
    const groupedIndex = []
    const realIndex = []
    let totalGroups = 0

    if (groupKey && items) {
      const groups = []
      let lastGroup = null

      items.forEach((item, itemIndex) => {
        const index = itemIndex + totalGroups
        realIndex[itemIndex] = index
        if (lastGroup !== item[groupKey]) {
          lastGroup = item[groupKey]
          // if is separator
          if (lastGroup) {
            groups.push({ index, name: lastGroup })
            totalGroups++
            groupedIndex[index] = true // separator
            groupedIndex[index + 1] = itemIndex // next
            return
          }
        }
        groupedIndex[index] = itemIndex
      })

      for (const { index, name } of groups) {
        let child
        if (virtualized) {
          child = (extraProps: Object) => (
            <separator {...extraProps}>{name}</separator>
          )
        } else {
          child = <separator key={name}>{name}</separator>
        }
        children.splice(index, 0, child)
      }
    }

    this.children = children
    this.totalGroups = totalGroups
    this.realIndex = realIndex
    this.groupedIndex = groupedIndex
    this.childrenVersion = Math.random()
  }

  render() {
    const { children } = this
    if (!children) {
      return null
    }
    const {
      virtualized,
      parentSize,
      scrollable,
      style,
      attach,
      controlled,
    } = this.props
    let { width, height } = this.props
    if (virtualized && parentSize) {
      height = parentSize.height || height || 0
      width = parentSize.width || width || 0
    }
    const { totalItems, totalGroups, realIndex } = this
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
        <VirtualList
          if={virtualized}
          height={height}
          width={width}
          ref={this.ref('virtualListRef').set}
          overscanRowCount={3}
          scrollToIndex={realIndex[this.state.selected]}
          rowCount={totalItems + totalGroups}
          rowRenderer={this.getRow}
          {...virtualized}
          rowHeight={this.getRowHeight}
        />
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
