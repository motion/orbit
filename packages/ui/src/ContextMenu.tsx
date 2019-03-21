import { Contents, ViewProps } from '@o/gloss'
import React, { forwardRef, useContext, useEffect } from 'react'
import { ContextMenuContext, ContextMenuHandler, MenuTemplate } from './ContextMenuProvider'

type UseContextProps = {
  items?: MenuTemplate
  buildItems?: () => MenuTemplate
}

type ContextMenuProps = ViewProps &
  UseContextProps & {
    children: React.ReactNode
    component?: React.ComponentType<any> | string
  }

export const ContextMenu = forwardRef<ContextMenuHandler, ContextMenuProps>(function ContextMenu(
  props,
  ref,
) {
  const { children, component = Contents, items, buildItems, ...restProps } = props
  const context = useContext(ContextMenuContext)
  const { onContextMenu } = useContextMenu({ items, buildItems })

  useEffect(
    () => {
      if (ref) {
        ref['current'] = context
      }
    },
    [ref, context],
  )

  return React.createElement(
    component,
    {
      onContextMenu,
      ...restProps,
    },
    children,
  )
})

export function useContextMenu({ items, buildItems }: UseContextProps) {
  const context = useContext(ContextMenuContext)

  if (!context) {
    console.warn('no context')
    return {}
  }

  const { setItems } = context

  const onContextMenu = React.useCallback(
    () => {
      if (typeof setItems === 'function') {
        if (items != null) {
          setItems(items)
        } else if (buildItems != null) {
          setItems(buildItems())
        }
      }
    },
    [buildItems, JSON.stringify(items)],
  )

  return { onContextMenu }
}
