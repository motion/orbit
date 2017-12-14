// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import ListItem from './listItem'
import { List as VirtualList } from 'react-virtualized'
import parentSize from '~/helpers/parentSize'
import type { Props as ItemProps } from './listItem'
import Separator from './separator'
import { isArrayLike } from 'mobx'
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import { throttle, debounce } from 'lodash'

const idFn = _ => _
const SCROLL_BAR_WIDTH = 16

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
  groupBy?: string,
  selected?: number,
  separatorHeight: number,
  isSelected?: Function,
  virtualized?: { rowHeight: number | ((a: number) => number) },
  // force update children
  updateChildren?: boolean,
  captureClickEvents?: boolean,
  separatorProps?: Object,
  // row to scroll to after render
  // only tries if different than last scrolled to row
  scrollToRow?: number,
  // passes react-virtualized onScroll to here
  onScroll?: Function,
}

type VirtualItemProps = {
  index: number,
  key: string,
  style: Object,
  parent: any,
}

@parentSize('virtualized', 'parentSize')
@view.ui
class List extends React.PureComponent<Props, { selected: number }> {
  static Item = ListItem

  static defaultProps = {
    getItem: idFn,
    onHighlight: idFn,
  }

  state = {
    selected: -1,
  }

  // for tracking list resizing for virtual lists
  onRef = []
  children: ?Array<any>
  totalItems = null
  itemRefs: Array<HTMLElement> = []
  lastDidReceivePropsDate: ?number
  virtualListRef: ?VirtualList = null
  lastSelectionDate: ?number
  realIndex: ?Array<number>
  groupedIndex: ?Array<number>
  totalGroups: number = 0

  componentWillMount() {
    this.totalItems = this.getTotalItems(this.props)

    if (typeof this.props.defaultSelected !== 'undefined') {
      this.setState({ selected: this.props.defaultSelected })
    }

    if (this.props.getRef) {
      this.props.getRef(this)
    }

    this.updateChildren()

    this.setTimeout(() => {
      // TODO stupid ass bugfix, for some reason lists started flickering
      // likely a bug with our cellmeasurer, or maybe even gloss
      // this seems to fix for now
      if (this.props.virtualized) {
        this.setState({
          started: true,
        })
      }
    })
  }

  componentDidMount() {
    if (this.props.virtualized && this.props.virtualized.measure) {
      this.measure()
    }

    if (typeof this.props.scrollToRow === 'number') {
      this.scrollToRow(this.props.scrollToRow)
    }
  }

  componentDidUpdate() {
    if (
      typeof this.props.scrollToRow === 'number' &&
      this.props.scrollToRow !== this.lastScrolledToRow
    ) {
      this.scrollToRow(this.props.scrollToRow)
    }

    // if we changed children, scroll to row again
    if (this.didUpdateChildren && typeof this.lastScrolledToRow === 'number') {
      this.scrollToRow(this.lastScrolledToRow)
      this.didUpdateChildren = false
    }
  }

  // willUpdate only runs when PureComponent has new props
  componentWillUpdate(nextProps: Props) {
    const totalItems = this.getTotalItems(nextProps)
    const hasNeverSetChildren = !this.childrenVersion
    const hasNewSelected =
      typeof nextProps.selected === 'number' && this.state.selected !== selected
    const hasNewItems = this.totalItems !== totalItems
    const hasNewItemsKey =
      typeof nextProps.itemsKey !== 'undefined' &&
      nextProps.itemsKey !== this.props.itemsKey

    this.totalItems = totalItems

    const { virtualized, selected } = nextProps

    const shouldUpdateChildren =
      hasNeverSetChildren ||
      hasNewSelected ||
      !virtualized ||
      nextProps.updateChildren ||
      hasNewItems ||
      hasNewItemsKey

    if (shouldUpdateChildren) {
      this.props = nextProps
      this.updateChildren()
    }

    if (typeof selected !== 'undefined') {
      this.lastDidReceivePropsDate = Date.now()
      if (selected !== this.state.selected) {
        this.setState({ selected })
      }
    }

    if (
      nextProps.virtualized &&
      nextProps.virtualized.measure &&
      ((this.props.virtualized && !this.props.virtualized.measure) ||
        !this.props.virtualized)
    ) {
      this.measure()
    }
  }

  // sitrep
  forceUpdateGrid = () => {
    if (!this.virtualListRef) {
      this.onRef.push(() => this.forceUpdateGrid())
      return
    }
    // seems to work without this step
    // this.virtualListRef.forceUpdateGrid()
    this.virtualListRef.recomputeRowHeights(0)
    this.scrollToRow(this.lastScrolledToRow)
  }

  // sitrep
  scrollToRow = debounce((index: number) => {
    if (!this.virtualListRef) {
      this.onRef.push(() => this.scrollToRow(index))
      return
    }
    let row = index
    if (this.realIndex) {
      row = index === 0 ? 0 : this.realIndex[index] || index + this.totalGroups
    }
    this.virtualListRef.scrollToRow(row)
    this.lastScrolledToRow = index
  }, 8)

  focus() {
    if (!this.virtualListRef) {
      return
    }
    console.log('should focus but need a dom node')
    // this.virtualListRef.focus()
  }

  // sitrep
  measure = throttle(() => {
    if (this.virtualListRef) {
      this.virtualListRef.recomputeRowHeights(0)
      this.scrollToRow(this.lastScrolledToRow || 0)
    }
  }, 6)

  gatherRefs = (index: number) => (ref: ?HTMLElement) => {
    if (ref) {
      this.itemRefs[index] = ref
    }
  }

  getTotalItems = (props: Props) =>
    props.items ? props.items.length : React.Children.count(props.children)

  isSelected = (fn: Function) => (...args) =>
    typeof this.state.selected === 'number' ? fn(...args) : null

  // wrap weird signature
  select = (selector: number | Function) => {
    if (typeof selector === 'number') {
      this.highlightItem(() => selector)
    } else if (typeof selector === 'function' && this.props.items) {
      this.highlightItem(() => this.props.items.findIndex(selector))
    }
  }

  highlightItem(setter: (a: number) => number, event?: Event) {
    const selected = setter(this.state.selected)
    const hasSelectCb = !!this.props.onSelect
    if (hasSelectCb && event && this.props.captureClickEvents) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.lastSelectionDate = Date.now()
    // only setstate if controlled
    if (this.props.controlled) {
      this.setState({ selected }, () => {
        if (hasSelectCb) {
          this.props.onSelect(this.selected, selected)
        }
      })
    } else {
      this.state.selected = selected
      if (hasSelectCb) {
        this.props.onSelect(this.selected, selected)
      }
    }
    return selected
  }

  get selected(): ?Object {
    const { selected } = this.state
    if (selected === null || !this.props.items) {
      return null
    } else {
      return this.props.items[selected]
    }
  }

  get showInternalSelection() {
    if (typeof this.props.selected !== 'undefined') {
      return true
    }
    if (this.props.isSelected) {
      return false
    }
    return this.lastSelectionDate > this.lastDidReceivePropsDate
  }

  rowRenderer = ({ index, key, style, parent }: VirtualItemProps) => {
    if (!this.children || !this.children[index]) {
      console.log('no child', index, this)
      return null
    }
    if (this.props.hideScrollBar) {
      style.width = `calc(${style.width || '100%'} - ${SCROLL_BAR_WIDTH}px)`
    }
    const child = this.children[index]({ style })
    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {child}
      </CellMeasurer>
    )
  }

  getItemProps(index: number, rowProps: Object, isListItem: boolean) {
    const {
      onItemMount,
      size,
      onSelect,
      controlled,
      itemProps,
      isSelected,
      selected,
      segmented,
      highlight,
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
            highlight,
            index,
            isFirstElement: index === 0,
            isLastElement: index === this.totalItems - 1,
          }
        : {
            ref: getRef,
          }),
      ...itemProps,
    }
    // fallback key
    props.key = props.key || index
    // handle click
    if (onSelect || controlled) {
      const ogClick = props.onClick
      props.onClick = event => {
        this.highlightItem(() => index, event)
        if (ogClick) {
          ogClick.call(this, event)
        }
      }
    }
    if (!this.props.virtualized && this.props.hideScrollBar) {
      props.style = props.style || {}
      props.style.width = `calc(${props.style.width ||
        '100%'} - ${SCROLL_BAR_WIDTH}px)`
    }
    // highlight logic
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
    const { items, virtualized, groupBy, parentSize, separatorProps } = props
    const hasChildren = props.children
    if (!items && !hasChildren) {
      return null
    }
    if (virtualized && !parentSize) {
      return null
    }
    let children
    if (hasChildren) {
      children = this.getListChildren(props.children)
    } else {
      if (isArrayLike(items)) {
        children = items.map(this.getListItem)
      } else {
        console.error('not array', items)
        return
      }
    }

    // if no need, just get them right away
    if (!virtualized) {
      children = children.map(child => child())
    }

    // grouping logic
    const groupedIndex = []
    let realIndex = []
    let totalGroups = 0

    if (groupBy && items) {
      const groups = []
      let lastGroup = null

      items.forEach((item, itemIndex) => {
        const index = itemIndex + totalGroups
        if (lastGroup !== item[groupBy]) {
          lastGroup = item[groupBy]
          // if is separator
          if (lastGroup) {
            groups.push({ index, name: lastGroup })
            totalGroups = totalGroups + 1
            groupedIndex[index] = true // separator
            groupedIndex[index + 1] = itemIndex // next
            return
          }
        }
        realIndex[itemIndex] = index - totalGroups
        groupedIndex[index] = itemIndex
      })

      realIndex = realIndex.filter(x => typeof x !== 'undefined')

      for (const { index, name } of groups) {
        let child = (extraProps: Object) => (
          <Separator
            $firstSeparator={index === 0}
            key={name}
            {...separatorProps}
            {...extraProps}
          >
            {name}
          </Separator>
        )
        if (!virtualized) {
          child = child()
        }
        children.splice(index, 0, child)
      }
    }

    this.cache = new CellMeasurerCache({
      defaultHeight: 50,
      fixedWidth: true,
    })

    this.didUpdateChildren = true
    this.children = children
    this.totalGroups = totalGroups
    if (totalGroups) {
      this.realIndex = realIndex
      this.groupedIndex = groupedIndex
    }
    this.childrenVersion = Math.random()
    if (virtualized) {
      this.setTimeout(this.forceUpdateGrid)
    }
  }

  setVirtualRef = ref => {
    if (ref) {
      this.virtualListRef = ref
      if (this.onRef.length) {
        this.onRef.forEach(x => x())
        this.onRef = []
      }
    }
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
      horizontal,
      hideScrollBar,
      onScroll,
    } = this.props
    if (virtualized && !parentSize) {
      return null
    }
    let { width, height } = this.props
    if (parentSize) {
      height = parentSize.height || height || 0
      width = parentSize.width || width || 0
    }
    if (width && hideScrollBar) {
      width += SCROLL_BAR_WIDTH
    }
    const { totalItems, totalGroups, realIndex } = this
    return (
      <list
        $visible={!virtualized || this.state.started}
        $hideScrollBar={hideScrollBar}
        onScroll={!virtualized && onScroll}
        style={{
          height: height || virtualized ? '100%' : 'auto',
          width,
          flexFlow: horizontal ? 'row' : null,
          overflowY: scrollable ? 'scroll' : 'auto',
          ...style,
        }}
        {...attach}
      >
        <VirtualList
          if={virtualized}
          deferredMeasurementCache={this.cache}
          height={height}
          width={width}
          ref={this.setVirtualRef}
          overscanRowCount={10}
          scrollToIndex={
            realIndex ? realIndex[this.state.selected] : this.state.selected
          }
          rowCount={totalItems + totalGroups}
          rowRenderer={this.rowRenderer}
          rowHeight={this.cache.rowHeight}
          onScroll={onScroll}
          {...virtualized}
        />
        <listinner if={!virtualized}>{children}</listinner>
      </list>
    )
  }

  static style = {
    list: {
      alignItems: 'stretch',
      overflowX: 'visible',
      visibility: 'hidden',
    },
    listinner: {
      height: 'auto',
    },
    hideScrollBar: {
      marginRight: -SCROLL_BAR_WIDTH,
    },
    visible: {
      visibility: 'visible',
    },
    firstSeparator: {
      paddingTop: 10,
    },
  }
}

export default List
