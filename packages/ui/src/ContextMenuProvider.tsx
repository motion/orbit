import { gloss } from '@mcro/gloss'
import React, { createContext, useRef } from 'react'

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

  const showContextMenu = (options = { direct: false }) => {
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
  }

  return (
    <ContextMenuContext.Provider
      value={{
        setItems: (items: MenuTemplate) => {
          template.current = items
        },
        show: showContextMenu,
      }}
    >
      <Container onContextMenu={showContextMenu}>{props.children}</Container>
    </ContextMenuContext.Provider>
  )
}

const Container = gloss({
  display: 'contents',
})
