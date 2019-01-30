import { Contents, ViewProps } from '@mcro/gloss'
import React, { useContext } from 'react'
import { ContextMenuContext, MenuTemplate } from './ContextMenuProvider'

type ContextMenuProps = ViewProps & {
  items?: MenuTemplate
  buildItems?: () => MenuTemplate
  children: React.ReactNode
  component?: React.ComponentType<any> | string
}

export function ContextMenu({
  children,
  component = Contents,
  items,
  buildItems,
  ...restProps
}: ContextMenuProps) {
  const setMenuItems = useContext(ContextMenuContext)

  if (!items) {
    return <>{children}</>
  }

  const onContextMenu = (_: React.MouseEvent) => {
    if (typeof setMenuItems === 'function') {
      if (items != null) {
        setMenuItems(items)
      } else if (buildItems != null) {
        setMenuItems(buildItems())
      }
    }
  }

  return React.createElement(
    component,
    {
      onContextMenu,
      ...restProps,
    },
    children,
  )
}
