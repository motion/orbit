/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { gloss, Row } from '@o/gloss'
import React, { Children, cloneElement, Suspense } from 'react'
import { colors } from './helpers/colors'
import { useUncontrolled } from './helpers/useUncontrolled'
import { Orderable } from './Orderable'
import { Loading } from './progress/Loading'
import { SegmentedRow } from './SegmentedRow'
import { Tab, TabItem } from './Tab'
import { Omit } from './types'
import { View, ViewProps } from './View/View'

export type TabsProps = Omit<ViewProps, 'order'> & {
  // tab height
  height?: number
  // Callback for when the active tab has changed.
  onActive?: (key: string | void) => void
  // The key of the currently active tab.
  active?: string | void
  // Tab elements.
  children?: any[] | React.ReactNode
  // Whether the tabs can be reordered by the user.
  sortable?: boolean
  // Callback when the tab order changes.
  onSort?: (order: string[]) => void
  // Order of tabs.
  order?: string[]
  // Whether to include the contents of every tab in the DOM and just toggle
  persist?: boolean
  // Whether to include a button to create additional items.
  newable?: boolean
  // Callback for when the new button is clicked.
  onNew?: () => void
  // Elements to insert before all tabs in the tab list.
  before?: any[]
  // Elements to insert after all tabs in the tab list.
  after?: any[]
  // extra props to pass to each tab
  tabProps?: ViewProps
  // extra props to pass to active tab
  tabPropsActive?: ViewProps
  // component to render each tab with
  TabComponent?: any
  // center the tabs
  centered?: boolean
  // tab radius sizing
  sizeRadius?: number
  // tab padding sizing
  sizePadding?: number
  // tab width
  tabWidth?: number | string
}

function TabsControlled({
  TabComponent = TabItem,
  tabProps,
  tabPropsActive,
  onActive,
  height = 26,
  borderRadius,
  onSort,
  onNew,
  order,
  before = [],
  after = [],
  active,
  persist,
  newable,
  sortable,
  children,
  centered,
  sizeRadius = 0,
  sizePadding = 1,
  tabWidth,
  ...rest
}: TabsProps) {
  const tabs = {}
  // a list of keys
  const keys = order ? order.slice() : []
  const tabSiblings = []
  const tabContents = []

  const tabPropsExtra: any = {
    minWidth: 'min-content',
    height,
    borderRadius,
  }

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
      const { closable, label, icon, onClose, width } = comp.props
      const compChildren = comp.props.children
      let id = comp.props.id
      if (typeof id !== 'string') {
        id = `${index}`
      }
      if (!keys.includes(id)) {
        keys.push(id)
      }
      const isActive: boolean = active === id

      if (isActive || persist === true || comp.props.persist === true) {
        tabContents.push(
          <TabContent key={id} hidden={!isActive}>
            <Suspense fallback={<Loading />}>
              {typeof compChildren === 'function' && isActive ? compChildren() : compChildren}
            </Suspense>
          </TabContent>,
        )
      }

      // this tab has been hidden from the tab bar but can still be selected if it's key is active
      if (comp.props.hidden) {
        continue
      }
      let closeButton
      tabs[id] = (
        <TabComponent
          key={id}
          className={isActive ? 'tab-active' : 'tab-inactive'}
          {...tabPropsExtra}
          {...tabProps}
          width={width || tabWidth}
          {...isActive && tabPropsActive}
          active={isActive}
          onMouseDown={
            !isActive && onActive
              ? (event: MouseEvent) => {
                  if (event.target !== closeButton) {
                    onActive(id)
                  }
                }
              : undefined
          }
          debug={label === 'Tree To Inspector' ? true : false}
          icon={icon}
        >
          {label}
          {closable && (
            <CloseButton
              ref={ref => (closeButton = ref)}
              onMouseDown={() => {
                if (isActive && onActive) {
                  const idx = keys.indexOf(id)
                  const newActive = keys[idx + 1] || keys[idx - 1] || null
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

  const childrenArr = Children.map(children, child => child)
  add(childrenArr)

  let tabList
  if (sortable === true) {
    tabList = (
      <OrderableContainer key="orderable-list">
        <Orderable orientation="horizontal" items={tabs} onChange={onSort} order={keys} />
      </OrderableContainer>
    )
  } else {
    tabList = []
    for (const key in tabs) {
      tabList.push(tabs[key])
    }
  }

  if (newable === true) {
    after.push(<TabItem {...tabPropsExtra} icon="add" key={keys.length} onMouseDown={onNew} />)
  }

  return (
    <TabContainer>
      <Row
        maxWidth="100%"
        margin={centered ? 'auto' : 'inherit'}
        justifyContent={centered ? 'center' : 'inherit'}
        {...rest}
      >
        <SegmentedRow sizePadding={sizePadding} sizeRadius={sizeRadius}>
          {before}
          <View
            {...{
              flex: 1,
              overflow: 'hidden',
              height,
            }}
          >
            <HideScrollbar className="hide-scrollbars">
              {Children.map(tabList, (child, key) =>
                cloneElement(child, { key, flex: centered ? 'auto' : 1 }),
              )}
            </HideScrollbar>
          </View>
          {after}
        </SegmentedRow>
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
  return <TabsControlled {...controlledProps} />
}

const HideScrollbar = gloss({
  flexFlow: 'row',
  overflowX: 'auto',
  overflowY: 'hidden',
  flex: 1,
  // because we use box shadows for outlines
  // margin: [0, 1],
  height: '100%',
  boxSizing: 'content-box',
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
