// @flow
import React, { Children, cloneElement } from 'react'
import { view, Shortcuts } from '@mcro/black'
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
  itemStyle?: Object,
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

  actions = {
    down: () => {
      this.highlightItem(
        cur => Math.min(this.totalItems, cur + 1),
        this.onSelect
      )
    },
    cmdEnter: () => {
      this.props.onCmdEnter && this.props.onCmdEnter(this.selected)
    },
    up: () => {
      this.highlightItem(cur => Math.max(0, cur - 1), this.onSelect)
    },
    enter: () => {
      this.highlightItem(() => this.state.selected, this.onSelect)
    },
  }

  handleShortcuts = (action, event) => {
    if (this.state.selected === null) {
      return
    }
    if (this.actions[action]) {
      console.log('List.action', action)
      event.preventDefault()
      event.stopPropagation()
      this.actions[action](event)
    }
  }

  onSelect = () => {
    if (this.props.onSelect) {
      this.props.onSelect(this.selected, this.state.selected)
    }
  }

  totalItems = () => {
    // TODO could check children length?
    return this.props.items.length
  }

  // wrap weird signature
  select = (index: number) => {
    console.log('selecting', index)
    this.highlightItem(() => index)
  }

  highlightItem = (setter: () => number | null, cb: Function) => {
    const selected = setter(this.state.selected)
    this.setState({ selected }, () => {
      this.props.onHighlight(this.selected, selected)
      if (cb) cb()
    })
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

  render({
    borderColor,
    borderRadius,
    children,
    controlled,
    getItem,
    height: userHeight,
    itemProps,
    items,
    itemStyle,
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
      css: itemStyle,
      onItemMount,
      size,
      borderRadius,
      borderColor,
    }

    const total = items ? items.length : Children.count(children)
    const getItemProps = (i, rowProps, isListItem) => {
      const positionProps = {
        segmented,
        isFirstElement: i === 0,
        isLastElement: i === total - 1,
      }
      const props = {
        key: i,
        ...itemProps,
        ...rowProps,
        ...(isListItem ? passThroughProps : null),
        ...(isListItem ? positionProps : null),
      }
      if (controlled) {
        const ogClick = props.onClick
        props.onClick = e => {
          this.highlightItem(() => i, this.onSelect)
          if (ogClick) {
            ogClick.call(this, e)
          }
        }
        props.highlight = i === this.state.selected
      }
      return props
    }

    const getListItem = (cur, i) => rowProps => {
      const item = getItem(cur, i)
      if (item === null) {
        return null
      }
      if (React.isValidElement(item)) {
        return React.cloneElement(item, getItemProps(i, rowProps))
      }
      // pass object to ListItem
      return (
        <ListItem
          key={item.key || cur.id || cur._id || i}
          {...getItemProps(i, rowProps, true)}
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
      ? Children.map(children, (item, i) => rowProps =>
          item
            ? cloneElement(
                item,
                getItemProps(i, rowProps, item.type.isListItem)
              )
            : null
        )
      : items.map(getListItem)

    // if no need, just get them right away
    if (!virtualized) {
      chillen = chillen.map(child => child())
    }

    return (
      <Shortcuts name="all" handler={this.handleShortcuts}>
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
      </Shortcuts>
    )
  }
}

List.Item = ListItem

export default List
