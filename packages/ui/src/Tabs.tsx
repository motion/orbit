/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import * as React from 'react'
import { view } from '@mcro/black'
import { View } from './blocks/View'
import { Row } from './blocks/Row'
import { Orderable } from './Orderable'
import { colors } from './helpers/colors'
import { Tab } from './Tab'

export type TabsProps = {
  // Callback for when the active tab has changed.
  onActive?: (key: string | void) => void
  // The key of the default active tab.
  defaultActive?: string
  // The key of the currently active tab.
  active?: string | void
  // Tab elements.
  children?: Array<any>
  // Whether the tabs can be reordered by the user.
  orderable?: boolean
  // Callback when the tab order changes.
  onOrder?: (order: Array<string>) => void
  // Order of tabs.
  order?: Array<string>
  // Whether to include the contents of every tab in the DOM and just toggle
  persist?: boolean
  // Whether to include a button to create additional items.
  newable?: boolean
  // Callback for when the new button is clicked.
  onNew?: () => void
  // Elements to insert before all tabs in the tab list.
  before?: Array<any>
  // Elements to insert after all tabs in the tab list.
  after?: Array<any>
}

const TabContainer = view(View, {
  height: 'auto',
})

const TabList = view(Row, {
  alignItems: 'stretch',
})

const TabListItem = view(Row, {
  flex: 1,
  fontSize: 13,
  lineHeight: '28px',
  overflow: 'hidden',
  padding: [3, 10],
  position: 'relative',
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  userSelect: 'none',
})

TabListItem.theme = ({ theme, active }) => ({
  color: active ? theme.active.color : theme.inactive.color,
  // this is reversed because technically active tabs should match the bgcolor
  background: active ? theme.active.background : theme.inactive.background,
  '&:hover': {
    color: active ? theme.active.color : theme.hover.color,
    background: active
      ? theme.base.background
      : theme.active.background.lighten(0.01),
  },
})

const TabListAddItem = view(TabListItem, {
  borderRight: 'none',
  flex: 0,
  flexGrow: 0,
  fontWeight: 'bold',
})

const CloseButton = view({
  color: '#000',
  float: 'right',
  fontSize: 10,
  fontWeight: 'bold',
  textAlign: 'center',
  marginLeft: 6,
  marginTop: 6,
  width: 16,
  height: 16,
  lineHeight: '16px',
  borderRadius: '50%',
  '&:hover': {
    background: colors.cherry,
    color: '#fff',
  },
})

const OrderableContainer = view({
  display: 'inline-block',
})

const TabContent = view({
  height: 'auto',
  overflow: 'auto',
  width: '100%',
})

export function Tabs(props: TabsProps) {
  const { onActive } = props
  const active = props.active == null ? props.defaultActive : props.active
  // array of other components that aren't tabs
  const before = props.before || []
  const after = props.after || []
  const tabs = {}
  // a list of keys
  const keys = props.order ? props.order.slice() : []
  const tabContents = []
  const tabSiblings = []

  function add(comps) {
    for (const comp of [].concat(comps || [])) {
      if (Array.isArray(comp)) {
        add(comp)
        continue
      }
      if (!comp) {
        continue
      }
      // for some reason had to check constructor instead
      if (comp.type.constructor !== Tab.constructor) {
        // if element isn't a tab then just push it into the tab list
        tabSiblings.push(comp)
        continue
      }
      const { children, closable, label, onClose, width } = comp.props
      const key = comp.key == null ? label : comp.key
      if (typeof key !== 'string') {
        throw new Error('tab needs a string key or a label')
      }
      if (!keys.includes(key)) {
        keys.push(key)
      }
      const isActive: boolean = active === key
      if (isActive || props.persist === true || comp.props.persist === true) {
        tabContents.push(
          <TabContent key={key} hidden={!isActive}>
            {children}
          </TabContent>,
        )
      }
      // this tab has been hidden from the tab bar but can still be selected if it's key is active
      if (comp.props.hidden) {
        continue
      }
      let closeButton
      tabs[key] = (
        <TabListItem
          key={key}
          width={width}
          active={isActive}
          onMouseDown={
            !isActive && onActive
              ? (event: MouseEvent) => {
                  if (event.target !== closeButton) {
                    onActive(key)
                  }
                }
              : undefined
          }
        >
          {comp.props.label}
          {closable && (
            <CloseButton // eslint-disable-next-line react/jsx-no-bind
              forwardRef={ref => (closeButton = ref)} // eslint-disable-next-line react/jsx-no-bind
              onMouseDown={() => {
                if (isActive && onActive) {
                  const index = keys.indexOf(key)
                  const newActive = keys[index + 1] || keys[index - 1] || null
                  onActive(newActive)
                }
                onClose()
              }}
            >
              X
            </CloseButton>
          )}
        </TabListItem>
      )
    }
  }

  add(props.children)

  let tabList
  if (props.orderable === true) {
    tabList = (
      <OrderableContainer key="orderable-list">
        <Orderable
          orientation="horizontal"
          items={tabs}
          onChange={props.onOrder}
          order={keys}
        />
      </OrderableContainer>
    )
  } else {
    tabList = []
    for (const key in tabs) {
      tabList.push(tabs[key])
    }
  }

  if (props.newable === true) {
    after.push(
      <TabListAddItem key={keys.length} onMouseDown={props.onNew}>
        +
      </TabListAddItem>,
    )
  }

  return (
    <TabContainer>
      <TabList>
        {before}
        {tabList}
        {after}
      </TabList>
      {tabContents}
      {tabSiblings}
    </TabContainer>
  )
}
