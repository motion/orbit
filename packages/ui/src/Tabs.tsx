/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { gloss, Row, View, ViewProps } from '@o/gloss'
import React, { Children, cloneElement } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { colors } from './helpers/colors'
import { useUncontrolled } from './helpers/useUncontrolled'
import { Orderable } from './Orderable'
import { Tab, TabItem } from './Tab'
import { Omit } from './types'

export type TabsProps = Omit<ViewProps, 'order'> & {
  // height
  height?: number
  // Callback for when the active tab has changed.
  onActive?: (key: string | void) => void
  // The key of the currently active tab.
  active?: string | void
  // Tab elements.
  children?: Array<any> | React.ReactNode
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
  // extra props to pass to each tab
  tabProps?: ViewProps
  // extra props to pass to active tab
  tabPropsActive?: ViewProps
  // component to render each tab with
  TabComponent?: any
}

function TabsControlled(props: TabsProps) {
  const {
    TabComponent = TabItem,
    tabProps,
    tabPropsActive,
    onActive,
    height = 26,
    borderRadius = 0,
    ...rest
  } = props
  // array of other components that aren't tabs
  const before = props.before || []
  const after = props.after || []
  const tabs = {}
  // a list of keys
  const keys = props.order ? props.order.slice() : []
  const tabSiblings = []
  const tabContents = []

  function add(comps) {
    for (const [index, comp] of [].concat(comps || []).entries()) {
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
      const { children, closable, label, icon, onClose, width } = comp.props
      let key = comp.key
      if (typeof key !== 'string') {
        key = `${index}`
      }
      if (!keys.includes(key)) {
        keys.push(key)
      }
      const isActive: boolean = props.active === key

      if (isActive || props.persist === true || comp.props.persist === true) {
        tabContents.push(
          <TabContent key={key} hidden={!isActive}>
            {typeof children === 'function' && isActive ? children() : children}
          </TabContent>,
        )
      }

      // this tab has been hidden from the tab bar but can still be selected if it's key is active
      if (comp.props.hidden) {
        continue
      }
      let closeButton
      const onMouseDown =
        !isActive && onActive
          ? (event: MouseEvent) => {
              if (event.target !== closeButton) {
                onActive(key)
              }
            }
          : undefined

      tabs[key] = (
        <TabComponent
          key={key}
          className={isActive ? 'tab-active' : 'tab-inactive'}
          width={width}
          borderRadius={borderRadius}
          {...tabProps}
          {...isActive && tabPropsActive}
          active={isActive}
          onMouseDown={onMouseDown}
          icon={icon}
        >
          {label}
          {closable && (
            <CloseButton
              ref={ref => (closeButton = ref)}
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
        </TabComponent>
      )
    }
  }

  const childrenArr = Children.map(props.children, child => child)
  add(childrenArr)

  let tabList
  if (props.orderable === true) {
    tabList = (
      <OrderableContainer key="orderable-list">
        <Orderable orientation="horizontal" items={tabs} onChange={props.onOrder} order={keys} />
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
      <Row {...rest}>
        {before}
        <div style={{ width: '100%', overflow: 'hidden', height }}>
          <HideScrollbar className="hide-scrollbars">
            <Breadcrumbs flex={1}>
              {Children.map(tabList, (child, key) => cloneElement(child, { key }))}
            </Breadcrumbs>
          </HideScrollbar>
        </div>
        {after}
      </Row>
      {tabContents}
      {tabSiblings}
    </TabContainer>
  )
}

const TabContainer = gloss(View, {
  flex: 1,
  overflow: 'hidden',
})

export function Tabs({ defaultActive = '0', ...props }: TabsProps & { defaultActive?: string }) {
  const controlledProps = useUncontrolled(
    { defaultActive, ...props },
    {
      active: 'onActive',
    },
  )
  return (
    // <Theme select={theme => theme.titleBar}>
    <TabsControlled {...controlledProps} />
    // </Theme>
  )
}

const HideScrollbar = gloss({
  flexFlow: 'row',
  overflowX: 'auto',
  overflowY: 'hidden',
  width: '100%',
  height: '100%',
  boxSizing: 'content-box',
})

const TabListAddItem = gloss(TabItem, {
  borderRight: 'none',
  flex: 0,
  flexGrow: 0,
  fontWeight: 'bold',
})

const CloseButton = gloss({
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

const OrderableContainer = gloss({
  display: 'inline-block',
})

const TabContent = gloss({
  overflow: 'auto',
  width: '100%',
  flex: 1,
  height: 'min-content',
})
