// @flow
import React, { Children, cloneElement } from 'react'
import { view } from '@mcro/black'
import { HotKeys } from 'react-hotkeys'
import FakeText from './fake/fakeText'
import { range } from 'lodash'
import ListItem from './listItem'
import { List as VirtualList } from 'react-virtualized'
import parentSize from '~/helpers/parentSize'
import type { ItemProps } from './listItem'
import Surface from './surface'
import type { Color } from '@mcro/gloss'

const idFn = _ => _

export type Props = {
  borderColor?: Color,
  borderRadius?: number,
  children?: React$Element<any>,
  controlled?: boolean,
  flex?: boolean | number,
  getItem?: Function,
  getRef?: Function,
  height?: number,
  horizontal?: boolean,
  itemProps?: Object,
  items?: Array<ItemProps | React$Element<any>>,
  loading?: boolean,
  onHighlight: Function,
  onItemMount?: Function,
  onSelect: Function,
  parentSize?: boolean,
  placeholder?: any,
  rowHeight?: number,
  scrollable?: boolean,
  segmented?: boolean,
  size?: number,
  style?: Object,
  width?: number,
}

@parentSize('virtualized')
@view.ui
class List {
  props: Props

  static defaultProps = {
    getItem: idFn,
    onSelect: idFn,
    onHighlight: idFn,
  }

  state = {
    selected: null,
  }

  // for tracking list resizing for virtual lists
  totalItems = null

  componentDidMount() {
    this.totalItems = this.getTotalItems(this.props)
  }

  componentWillReceiveProps = nextProps => {
    this.lastDidReceivePropsDate = Date.now()
    const totalItems = this.getTotalItems(nextProps)
    if (totalItems !== this.totalItems) {
      this.totalItems = totalItems
      // resize to fit
      if (nextProps.parentSize) {
        nextProps.parentSize.measure()
      }
    }
  }

  getTotalItems = props =>
    props.items ? props.items.length : Children.count(props.children)

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

  highlightItem = (setter: () => number | null, cb: Function) => {
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
    return this.lastSelectionDate > this.lastDidReceivePropsDate
  }

  render({
    borderColor,
    borderRadius,
    children,
    controlled,
    getItem,
    height: userHeight,
    itemProps,
    items,
    loading,
    onHighlight,
    onItemMount,
    onSelect,
    virtualized,
    placeholder,
    scrollable,
    segmented,
    size,
    style,
    width: userWidth,
    virtualProps,
    isSelected,
    parentSize,
    ...props
  }: Props) {
    if (!items && !children) {
      return null
    }

    let height = userHeight
    let width = userWidth

    if (virtualized && !parentSize) {
      return null
    }
    if (virtualized) {
      height = parentSize.height || userHeight
      width = parentSize.width || userWidth
    }

    const passThroughProps = {
      height: virtualized ? virtualized.rowHeight : undefined,
      onItemMount,
      size,
      borderRadius,
      borderColor,
      ...itemProps,
    }

    const total = items ? items.length : Children.count(children)

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
      }
      if (controlled) {
        const ogClick = props.onClick
        props.onClick = e => {
          this.highlightItem(() => index)
          if (ogClick) {
            ogClick.call(this, e)
          }
        }
        props.highlight = this.showInternalSelection
          ? index === this.state.selected
          : this.props.isSelected && this.props.isSelected(items[index], index)
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

    if (placeholder) {
      return (
        <list {...props}>
          {range(10).map(i =>
            <ListItem
              key={i}
              fakeAvatar
              placeholder
              primary={<FakeText lines={1} fontSize={12} />}
              secondary={<FakeText lines={1} fontSize={10} />}
            />
          )}
        </list>
      )
    }

    // allow passing of rowProps by wrapping each in function
    let chillen = children
      ? Children.map(children, (item, index) => rowProps =>
          item
            ? cloneElement(
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

    return (
      <HotKeys handlers={this.actions}>
        <Surface
          tagName="list"
          align="stretch"
          height={height}
          width={width}
          style={{
            overflowY: scrollable ? 'scroll' : 'auto',
            overflowX: 'visible',
            ...style,
          }}
          borderRadius={borderRadius}
          {...props}
        >
          <loading if={loading}>loading</loading>
          <VirtualList
            if={!loading && virtualized}
            height={height}
            width={width}
            rowCount={total}
            rowHeight={100}
            rowRenderer={({ index, key, style }) =>
              chillen[index]({ key, style })}
            {...virtualized}
          />
          {!virtualized && chillen}
        </Surface>
      </HotKeys>
    )
  }
}

List.Item = ListItem

export default List
