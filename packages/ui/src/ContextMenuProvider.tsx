import { gloss } from '@mcro/gloss'
import React, { createContext, useRef } from 'react'

export const ContextMenuContext = createContext<(items: MenuTemplate) => void>(null)

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
  const menuTemplate = useRef([])

  return (
    <ContextMenuContext.Provider
      value={(items: MenuTemplate) => {
        menuTemplate.current = items
      }}
    >
      <Container
        onContextMenu={() => {
          const currentMenu = menuTemplate.current
          menuTemplate.current = []
          if (props.onContextMenu) {
            props.onContextMenu(currentMenu)
            return
          }
          const menu = require('electron').remote.Menu.buildFromTemplate(currentMenu)
          menu.popup({ window: require('electron').remote.getCurrentWindow() })
        }}
      >
        {props.children}
      </Container>
    </ContextMenuContext.Provider>
  )
}

const Container = gloss({
  display: 'contents',
})
