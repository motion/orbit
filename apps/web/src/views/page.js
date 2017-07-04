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
  static isPageSidebar = true
  render({ children, onChildren }) {
    if (onChildren) onChildren(children)
    return null
  }
}

@view
class PageActions {
  static isPageActions = true
  render({ children, onChildren }) {
    if (onChildren) onChildren(children)
    return null
  }
}

@view
export default class Page {
  static Actions = PageActions
  static Sidebar = PageSidebar

  actions = null
  sidebar = null
  onChildren = type => debounce(children => (this[type] = children))

  render({ children, sidebar, actions, className }: Props) {
    log(children)
    return (
      <page className={className}>
        <SlotFill.Fill name="actions">
          {this.actions || actions}
        </SlotFill.Fill>
        <SlotFill.Fill if={this.sidebar || sidebar} name="sidebar">
          {this.sidebar || sidebar}
        </SlotFill.Fill>
        {React.Children.map(children, child => {
          if (child) {
            console.log('got a', child)
            if (child.isPageActions || child.isPageSidebar) {
              debugger
              const type = child.isPageActions ? 'actions' : 'sidebar'
              return React.cloneElement(child, {
                onChildren: log(this.onChildren(type)),
              })
            }
            return child
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
