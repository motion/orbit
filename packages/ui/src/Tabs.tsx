import { selectDefined } from '@o/utils'
import { Box, gloss } from 'gloss'
import React, { Children, cloneElement, Suspense } from 'react'

import { colors } from './helpers/colors'
import { useUncontrolled } from './helpers/useUncontrolled'
import { Orderable } from './Orderable'
import { Loading } from './progress/Loading'
import { Tab, TabItem } from './Tab'
import { Omit } from './types'
import { Col } from './View/Col'
import { Row } from './View/Row'
import { View, ViewProps } from './View/View'

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
export type TabsProps = Omit<ViewProps, 'order'> & {
  /** tab height */
  height?: number
  /** Callback for when the active tab has changed. */
  onChange?: (key: string | void) => void
  /** The key of the currently active tab. */
  active?: number | string | void
  /** Uncontrolled active state (use with onChange). */
  defaultActive?: string | boolean
  /** Tab elements. */
  children?: any[] | React.ReactNode
  /** Whether the tabs can be reordered by the user. */
  sortable?: boolean
  /** Callback when the tab order changes. */
  onSort?: (order: string[]) => void
  /** Order of tabs. */
  order?: string[]
  /** Whether to include the contents of every tab in the DOM and just toggle */
  persist?: boolean
  /** Whether to include a button to create additional items. */
  newable?: boolean
  /** Callback for when the new button is clicked. */
  onNew?: () => void
  /** Elements to insert before all tabs in the tab list. */
  before?: any[]
  /** Elements to insert after all tabs in the tab list. */
  after?: any[]
  /** extra props to pass to each tab */
  tabProps?: ViewProps
  /** extra props to pass to active tab */
  tabPropsActive?: ViewProps
  /** component to render each tab with */
  TabComponent?: any
  /** center the tabs */
  centered?: boolean
  /** tab radius sizing */
  sizeRadius?: number
  /** tab padding sizing */
  sizePadding?: number
  /** tab width */
  tabWidth?: number | string
}

function TabsControlled({
  TabComponent = TabItem,
  tabProps,
  tabPropsActive,
  onChange: onChange,
  height,
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

  function add(allTabs) {
    for (const [, tab] of [].concat(allTabs || []).entries()) {
      if (Array.isArray(tab)) {
        add(tab)
        continue
      }
      if (!tab) {
        continue
      }
      // for some reason had to check constructor instead
      if (tab.type.constructor !== Tab.constructor) {
        // if element isn't a tab then just push it into the tab list
        tabSiblings.push(tab)
        continue
      }
      const { closable, label, icon, onClose, width, ...rest } = tab.props
      const TabChildren = tab.props.children
      let id = getKey(tab)
      if (!keys.includes(id)) {
        keys.push(id)
      }
      const isActive: boolean = active == id

      const childrenElement =
        typeof TabChildren === 'function' ? isActive ? <TabChildren /> : null : TabChildren

      if (isActive || persist === true || tab.props.persist === true) {
        tabContents.push(
          <TabContent key={id} hidden={!isActive} {...rest}>
            <Suspense fallback={<Loading />}>{childrenElement}</Suspense>
          </TabContent>,
        )
      }

      // this tab has been hidden from the tab bar but can still be selected if it's key is active
      if (tab.props.hidden) {
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
          onClick={
            !isActive && onChange
              ? (event: MouseEvent) => {
                  if (event.target !== closeButton) {
                    onChange(id)
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
              onClick={() => {
                if (isActive && onChange) {
                  const idx = keys.indexOf(id)
                  const newActive = keys[idx + 1] || keys[idx - 1] || null
                  onChange(newActive)
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
        margin={centered ? [0, 'auto'] : 'inherit'}
        justifyContent={centered ? 'center' : 'inherit'}
        group
        {...rest}
      >
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
      </Row>
      {tabContents}
      {tabSiblings}
    </TabContainer>
  )
}

const TabContainer = gloss(View, {
  flex: 1,
  overflow: 'hidden',
  minHeight: 'max-content',
})

const getKey = comp => (comp ? comp.props.id || (comp.key && comp.key.replace('.$', '')) : null)

const controlledConfig = {
  active: 'onChange',
}

export function Tabs(props: TabsProps) {
  const cProps = useUncontrolled(props, controlledConfig)
  return <TabsControlled {...cProps} active={selectDefined(cProps.active, props.defaultActive)} />
}

const HideScrollbar = gloss(Box, {
  flexFlow: 'row',
  overflowX: 'auto',
  overflowY: 'hidden',
  flex: 1,
  // because we use box shadows for outlines
  // margin: [0, 1],
  height: '100%',
  boxSizing: 'content-box',
})

const CloseButton = gloss(Box, {
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

const OrderableContainer = gloss(Box, {
  display: 'inline-block',
})

const TabContent = gloss(Col, {
  overflow: 'auto',
  width: '100%',
  flex: 1,
  height: 'min-content',
})
