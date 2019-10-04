import React, { createContext, useCallback, useMemo, useRef } from 'react'

export type ContextMenuHandler = {
  show: Function
  setItems: (items: MenuTemplate) => void
}

export const ContextMenuContext = createContext<ContextMenuHandler>(null)

export type MenuTemplate = (
  | Partial<{
      checked: boolean
      click: Function
      enabled: boolean
      label: string
      visible: boolean
    }>
  | {
      type: 'separator'
    })[]

export function ContextMenuProvider(props: {
  children: React.ReactNode
  onContextMenu?: Function
}) {
  const template = useRef([])

  const showContextMenu = useCallback(
    (options: any = { direct: false }) => {
      const currentMenu = template.current
      template.current = []
      if (!options.direct) {
        if (props.onContextMenu) {
          props.onContextMenu(currentMenu)
          return
        }
      }
      const menu = require('electron').remote.Menu.buildFromTemplate(currentMenu)
      menu.popup({ window: require('electron').remote.getCurrentWindow(), ...options })
    },
    [props.onContextMenu],
  )

  const memoValue = useMemo(() => {
    return {
      setItems: (items: MenuTemplate) => {
        template.current = items
      },
      show: showContextMenu,
    }
  }, [showContextMenu])

  return (
    <ContextMenuContext.Provider value={memoValue}>
      <div style={{ display: 'contents' }} onContextMenu={showContextMenu}>
        {props.children}
      </div>
    </ContextMenuContext.Provider>
  )
}
