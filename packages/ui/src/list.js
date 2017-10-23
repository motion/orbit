// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import ListItem from './listItem'
import { List as VirtualList } from 'react-virtualized'
import parentSize from '~/helpers/parentSize'
import type { Props as ItemProps } from './listItem'
import Surface from './surface'
import { isArrayLike } from 'mobx'
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized'

const idFn = _ => _

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
  isSelected?: Function,
  virtualized?: { rowHeight: number | ((a: number) => number) },
  // force update children
  updateChildren?: boolean,
}

type VirtualItemProps = {
  index: number,
  key: string,
  style: Object,
  parent: any,
}

@parentSize('virtualized')
@view.ui
class List extends React.PureComponent<Props, { selected: number }> {
  static Item = ListItem

  static defaultProps = {
    getItem: idFn,
    onSelect: idFn,
    onHighlight: idFn,
  }

  state = {
    selected: -1,
  }

  // for tracking list resizing for virtual lists
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

  // willUpdate only runs when PureComponent has new props
  componentWillUpdate(nextProps: Props) {
    const { updateChildren, selected } = nextProps
    if (typeof selected !== 'undefined') {
      this.lastDidReceivePropsDate = Date.now()
      if (selected !== this.state.selected) {
        this.setState({ selected })
      }
    }

    const totalItems = this.getTotalItems(nextProps)

    const hasNewItems =
      totalItems !== this.totalItems ||
      this.props.itemsKey !== nextProps.itemsKey

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
      updateChildren ||
      (typeof selected === 'number' && this.state.selected !== selected) ||
      hasNewItems ||
      !this.childrenVersion
    ) {
      this.props = nextProps
      this.updateChildren()
    }

    if (nextProps.virtualized && nextProps.virtualized.measure) {
      this.measure()
    }
  }

  forceUpdateGrid() {
    return this.virtualListRef.forceUpdateGrid()
  }

  scrollToRow = (index: number) => {
    if (!this.virtualListRef) {
      return
    }
    let row = index
    if (this.realIndex) {
      row = index === 0 ? 0 : this.realIndex[index] || index + this.totalGroups
    }
    this.virtualListRef.scrollToRow(row)
  }

  focus() {
    if (!this.virtualListRef) {
      return
    }
    console.log('should focus but need a dom node')
    // this.virtualListRef.focus()
  }

  measure = () => {
    if (this.virtualListRef) {
      this.virtualListRef.recomputeRowHeights(0)
    }
  }

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

  highlightItem(setter: (a: number) => number, cb?: Function) {
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
    // fallback key
    props.key = props.key || index
    // handle click
    if (onSelect || controlled) {
      const ogClick = props.onClick
      props.onClick = e => {
        this.highlightItem(() => index)
        if (ogClick) {
          ogClick.call(this, e)
        }
      }
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
    const { items, virtualized, groupKey, parentSize } = props
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

    if (groupKey && items) {
      const groups = []
      let lastGroup = null

      items.forEach((item, itemIndex) => {
        const index = itemIndex + totalGroups
        if (lastGroup !== item[groupKey]) {
          lastGroup = item[groupKey]
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
          <separator $firstSeparator={index === 0} key={name} {...extraProps}>
            <notch />
            {name}
          </separator>
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

    this.children = children
    this.totalGroups = totalGroups
    if (totalGroups) {
      this.realIndex = realIndex
      this.groupedIndex = groupedIndex
    }
    this.childrenVersion = Math.random()
  }

  setVirtualRef = ref => {
    this.virtualListRef = ref
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
    } = this.props
    if (virtualized && !parentSize) {
      return null
    }
    let { width, height } = this.props
    if (virtualized && parentSize) {
      height = parentSize.height || height || 0
      width = parentSize.width || width || 0
    }
    const { totalItems, totalGroups, realIndex } = this
    return (
      <Surface
        $list
        $visible={!virtualized || this.state.started}
        flexFlow={horizontal ? 'row' : null}
        tagName="list"
        align="stretch"
        height={height}
        width={width}
        background="transparent"
        style={{
          overflowY: scrollable ? 'scroll' : 'auto',
          height: virtualized ? '100%' : 'auto',
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
          {...virtualized}
        />
        {!virtualized && children}
      </Surface>
    )
  }

  static style = {
    list: {
      overflowX: 'visible',
      visibility: 'hidden',
    },
    visible: {
      visibility: 'visible',
    },
    separator: {
      fontSize: 14,
      fontWeight: 500,
      padding: [6, 12, 6],
      justifyContent: 'center',
      // background: [0, 0, 0, 0.02],
      borderBottom: [1, [0, 0, 0, 0.05]],
      textAlign: 'left',
      color: [255, 255, 255, 0.3],
      pointerEvents: 'none',
      userSelect: 'none',
      position: 'relative',
    },
    notch: {
      position: 'absolute',
      bottom: 11,
      right: -3,
      height: 6,
      width: 6,
      opacity: 0,
      transform: {
        rotate: '45deg',
      },
      background: '#fff',
    },
    firstSeparator: {
      paddingTop: 10,
    },
  }
}

export default List
