import { Contents, ViewProps } from '@mcro/gloss'
import React, { forwardRef, useContext, useEffect } from 'react'
import { ContextMenuContext, ContextMenuHandler, MenuTemplate } from './ContextMenuProvider'

type ContextMenuProps = ViewProps & {
  items?: MenuTemplate
  buildItems?: () => MenuTemplate
  children: React.ReactNode
  component?: React.ComponentType<any> | string
}

export const ContextMenu = forwardRef<ContextMenuHandler, ContextMenuProps>(function ContextMenu(
  props,
  ref,
) {
  const { children, component = Contents, items, buildItems, ...restProps } = props
  const context = useContext(ContextMenuContext)
  const { setItems } = context

  useEffect(
    () => {
      if (ref) {
        ref['current'] = context
      }
    },
    [ref, context],
  )

  const onContextMenu = (_: React.MouseEvent) => {
    if (typeof setItems === 'function') {
      if (items != null) {
        setItems(items)
      } else if (buildItems != null) {
        setItems(buildItems())
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
})
