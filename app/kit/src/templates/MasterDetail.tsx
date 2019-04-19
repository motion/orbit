import {
  Layout,
  ListItemProps,
  Pane,
  PaneProps,
  SearchableList,
  SearchableListProps,
  Sidebar,
  SidebarProps,
  useMedia,
  View,
} from '@o/ui'
import React, { Fragment, useCallback, useMemo, useState } from 'react'

export type MasterDetailProps = SearchableListProps & {
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

  const contents =
    typeof children === 'function'
      ? selected === null
        ? placeholder || null
        : children(selected)
      : children

  const onSelect = useCallback(
    rows => {
      if (listProps.onSelect) {
        listProps.onSelect(rows[0])
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
    <SearchableList
      key="master"
      selectable
      {...listProps}
      onSelect={onSelect}
      itemProps={itemProps}
    />
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
