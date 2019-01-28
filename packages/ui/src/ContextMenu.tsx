import { Col, ViewProps } from '@mcro/gloss'
import React, { useContext } from 'react'
import { ContextMenuContext, MenuTemplate } from './ContextMenuProvider'

type ContextMenuProps = ViewProps & {
  items?: MenuTemplate
  buildItems?: () => MenuTemplate
  children: React.ReactNode
  component?: React.ComponentType<any> | string
}

export default function ContextMenu({
  children,
  component = Col,
  items,
  buildItems,
  ...restProps
}: ContextMenuProps) {
  const appendToContextMenu = useContext(ContextMenuContext)

  const onContextMenu = (_: React.MouseEvent) => {
    if (typeof appendToContextMenu === 'function') {
      if (items != null) {
        appendToContextMenu(items)
      } else if (buildItems != null) {
        appendToContextMenu(buildItems())
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
