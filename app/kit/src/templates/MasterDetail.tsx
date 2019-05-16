import { Layout, List, ListItemProps, ListProps, Pane, PaneProps, Sidebar, SidebarProps, useMedia, View } from '@o/ui'
import React, { Fragment, useCallback, useMemo, useState } from 'react'

import { Omit } from '../types'

// !!!

export type MasterDetailProps = Omit<any, 'children'> & {
  children?: React.ReactNode | ((selected: ListItemProps) => React.ReactNode)
  placeholder?: React.ReactNode
  masterProps?: PaneProps | SidebarProps
  detailProps?: PaneProps
  showSidebar?: boolean
}

export function MasterDetail({
  children,
  placeholder,
  masterProps,
  detailProps,
  showSidebar,
  ...listProps
}: MasterDetailProps) {
  const isSmall = useMedia({ maxWidth: 700 })
  const [selected, setSelected] = useState(null)

  let contents: React.ReactNode = null
  if (typeof children === 'function') {
    if (selected === null) {
      contents = placeholder || null
    } else {
      contents = children(selected)
    }
  } else {
    contents = children
  }

  const onSelect: ListProps['onSelect'] = useCallback(
    (rows, indices) => {
      if (listProps.onSelect) {
        listProps.onSelect(rows, indices)
        return
      }
      if (rows.length) {
        setSelected(rows[0])
      }
    },
    [listProps.onSelect],
  )

  const itemProps = useMemo(() => ({ iconBefore: true, ...listProps.itemProps }), [
    listProps.itemProps,
  ])

  const master = (
    <List key="master" selectable {...listProps} onSelect={onSelect} itemProps={itemProps} />
  )

  const detail = <Fragment key="detail">{contents}</Fragment>

  if (isSmall) {
    return (
      <>
        <Sidebar
          hidden={showSidebar === false}
          floating
          zIndex={10000000}
          elevation={5}
          {...masterProps as SidebarProps}
        >
          {master}
        </Sidebar>
        <View flex={1} zIndex={0} {...detailProps}>
          {detail}
        </View>
      </>
    )
  }

  return (
    <Layout type="row">
      <Pane
        resizable
        minWidth={300}
        maxWidth={450}
        {...showSidebar === false && { width: 0 }}
        {...masterProps as PaneProps}
      >
        {master}
      </Pane>
      <Pane flex={2} {...detailProps}>
        {detail}
      </Pane>
    </Layout>
  )
}
