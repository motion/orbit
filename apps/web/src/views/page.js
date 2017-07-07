// @flow
import React from 'react'
import { view } from '@mcro/black'
import { SlotFill } from '@mcro/ui'
import { debounce } from 'lodash'

type Props = {
  children?: React$Element<any>,
  sidebar?: React$Element<any>,
  actions?: React$Element<any>,
  className?: string,
}

@view
class PageSidebar {
  static pageType = 'sidebar'
  update = ({ children, onChildren }) => onChildren && onChildren(children)
  componentDidMount() {
    this.update(this.props)
  }
  componentDidUpdate() {
    this.update(this.props)
  }
  render() {
    return null
  }
}

@view
class PageActions {
  static pageType = 'actions'
  update = ({ children, onChildren }) => onChildren && onChildren(children)
  componentDidMount() {
    this.update(this.props)
  }
  componentDidUpdate() {
    this.update(this.props)
  }
  render() {
    return null
  }
}

@view
class SlotManager {
  render({ store }) {
    return (
      <manager>
        <SlotFill.Fill
          if={store.actions}
          key={store.actionsVersion}
          name="actions"
        >
          {store.actions}
        </SlotFill.Fill>
        <SlotFill.Fill
          if={store.sidebar}
          key={store.sidebarVersion}
          name="sidebar"
        >
          {store.sidebar}
        </SlotFill.Fill>
      </manager>
    )
  }
}

@view({
  store: class PageStore {
    actions = null
    actionsVersion = 0
    sidebar = null
    sidebarVersion = 0
    onChildren = type =>
      debounce(children => {
        this[type] = children
        this[`${type}Version`]++
      })
  },
})
export default class Page {
  static Actions = PageActions
  static Sidebar = PageSidebar

  render({ children, store, className }: Props) {
    return (
      <page className={className}>
        <SlotManager store={store} />
        {React.Children.map(children, child => {
          if (child) {
            if (child.type.pageType) {
              return React.cloneElement(child, {
                onChildren: store.onChildren(child.type.pageType),
              })
            }
          }
          return child
        })}
      </page>
    )
  }

  static style = {
    page: {
      // dont play with overflow here or react-grid will clip
      flex: 1,
      // dont add padding so we can add bottom bars
      overflow: 'visible',
      position: 'relative',
    },
  }
}
