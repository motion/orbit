// @flow
import React from 'react'
import { view } from '@mcro/black'
import { SlotFill } from '@mcro/ui'
import { debounce } from 'lodash'
import Actions from './page/actions'
import Children from './page/children'

const SIDEBAR_WIDTH = '30%'

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

  render({ showChildren, showActions, children, store, ...props }: Props) {
    return (
      <page {...props}>
        <pagecontents>
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
        </pagecontents>

        <sidebar if={showChildren || showActions}>
          <Actions
            if={showActions}
            style={{
              alignSelf: 'flex-end',
            }}
          />
          <Children allowInsert if={showChildren} />
          <line />
          <fade />
          <fade $bottom />
        </sidebar>
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
      width: '100%',
      maxWidth: '100%',
      position: 'relative',
      flexFlow: 'row',
      alignItems: 'flex-start',
    },
    pagecontents: {
      width: '100%',
      margin: [0, 'auto'],
      padding: [5, 0, 0],
      maxWidth: 960,
      maxHeight: '100%',
      flex: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    sidebar: {
      position: 'relative',
      maxWidth: SIDEBAR_WIDTH,
      minWidth: 60,
      zIndex: 50,
      top: -12,
      paddingTop: 15,
      right: 0,
      pointerEvents: 'none',
    },
    line: {
      position: 'absolute',
      top: 0,
      right: 31,
      bottom: 0,
      width: 1,
      background: '#eee',
      zIndex: -2,
    },
    fade: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      background: 'linear-gradient(#fff 30%, transparent)',
      zIndex: -1,
    },
    bottom: {
      top: 'auto',
      bottom: 0,
      background: 'linear-gradient(transparent,#fff)',
    },
  }
}
