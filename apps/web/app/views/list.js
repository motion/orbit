import React, { Children, cloneElement } from 'react'
import { view } from '~/helpers'
import FakeText from '~/views/fake/text'
import { range } from 'lodash'
import ListItem from './listItem'
import { List as VirtualList } from 'react-virtualized'
import parentSize from '~/views/helpers/parentSize'
import { Shortcuts } from 'react-shortcuts'

const idFn = _ => _

@parentSize
@view
class List {
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
    if (this.props.controlled) {
      this.addEvent(window, 'keydown', this.onKey)
    }
  }

  componentWillReceiveProps = nextProps => {
    const totalItems = this.getTotalItems(nextProps)
    if (totalItems !== this.totalItems) {
      this.totalItems = totalItems
      // resize to fit
      if (nextProps.parentSize) {
        nextProps.parentSize()
      }
    }
  }

  getTotalItems = props =>
    props.items ? props.items.length : Children.count(props.children)

  handleShortcuts = (action, event) => {
    if (this.state.selected === null) return
    switch (action) {
      case 'DOWN':
        this.highlightItem(cur => Math.min(this.totalItems, cur + 1))
        event.preventDefault()
        break
      case 'UP':
        this.highlightItem(cur => Math.max(0, cur - 1))
        event.preventDefault()
        break
      case 'ENTER':
        this.highlightItem(() => this.state.selected, this.onSelect)
        event.preventDefault()
        break
    }
  }

  onSelect = () => {
    this.props.onSelect(this.getSelected(), this.state.selected)
  }

  totalItems = () => {
    // TODO could check children length?
    return this.props.items.length
  }

  highlightItem = (setter: () => number | null, cb: Function) => {
    const selected = setter(this.state.selected)
    this.setState({ selected }, () => {
      this.props.onHighlight(this.getSelected(), selected)
      if (cb) cb()
    })
  }

  getSelected = () => {
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

  render() {
    const {
      children,
      items,
      loading,
      height: userHeight,
      width: userWidth,
      getItem,
      style,
      placeholder,
      horizontal,
      dark,
      padded,
      light,
      slim,
      small,
      flex,
      scrollable,
      controlled,
      onHighlight,
      onSelect,
      parentSize,
      rowHeight: propRowHeight,
      ...props
    } = this.props

    let rowHeight = propRowHeight
    let height = userHeight
    let width = userWidth

    if (slim && !rowHeight) {
      rowHeight = 22
    }

    if (rowHeight && !parentSize) {
      return null
    }
    if (rowHeight) {
      height = typeof userHeight === 'undefined'
        ? parentSize.height
        : userHeight
      width = typeof userWidth === 'undefined' ? parentSize.width : userWidth
    }

    const passThroughProps = { horizontal, dark, padded, light, slim }

    const total = items ? items.length : Children.count(children)
    const itemProps = (i, rowProps, isListItem) => {
      const positionProps = {
        isFirstElement: i === 0,
        isLastElement: i === total - 1,
      }

      const props = {
        key: i,
        ...rowProps,
        ...(isListItem ? passThroughProps : null),
        ...(isListItem ? positionProps : null),
      }

      if (controlled) {
        props.onClick = () => {
          this.highlightItem(() => i, this.onSelect)
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
        return React.cloneElement(item, itemProps(i, rowProps))
      }
      // pass object to ListItem
      return (
        <ListItem
          key={item.key || cur.id || i}
          {...itemProps(i, rowProps, true)}
          {...item}
        />
      )
    }

    if (placeholder) {
      return (
        <list {...props}>
          {range(10).map(i => (
            <ListItem
              key={i}
              fakeAvatar
              placeholder
              primary={<FakeText lines={1} fontSize={12} />}
              secondary={<FakeText lines={1} fontSize={10} />}
            />
          ))}
        </list>
      )
    }

    // allow passing of rowProps by wrapping each in function
    let chillen = children
      ? Children.map(children, (item, i) => rowProps =>
          item
            ? cloneElement(item, itemProps(i, rowProps, item.type.isListItem))
            : null)
      : items.map(getListItem)

    // if no need, just get them right away
    if (!rowHeight) {
      chillen = chillen.map(child => child())
    }

    return (
      <Shortcuts name="ALL" handler={this.handleShortcuts}>
        <list
          $$draggable
          style={{ minHeight: height, minWidth: width, ...style }}
          {...props}
        >
          <loading if={loading}>loading</loading>
          <VirtualList
            if={!loading && rowHeight}
            height={height}
            width={width}
            overscanRowCount={5}
            rowCount={total}
            rowHeight={rowHeight}
            rowRenderer={({ index, key, style }) =>
              chillen[index]({ key, style })}
          />
          {!rowHeight && chillen}
        </list>
      </Shortcuts>
    )
  }

  static style = {
    loading: {
      flex: 1,
    },
    list: {
      fontSize: 13,
      overflowY: 'auto',
    },
  }

  static theme = {
    horizontal: {
      list: {
        flexFlow: 'row',
        flexWrap: 'wrap !important',
        justifyContent: 'space-between',
      },
    },
    padded: {
      list: {
        padding: 10,
      },
    },
    wrap: {
      list: {
        flexFlow: 'row',
        flexWrap: 'wrap !important',
      },
    },
    scrollable: {
      list: {
        overflowY: 'scroll',
      },
    },
    flex: {
      list: {
        flex: 1,
      },
    },
  }
}

List.Item = ListItem

export default List
