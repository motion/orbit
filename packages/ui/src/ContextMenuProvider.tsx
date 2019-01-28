import { gloss } from '@mcro/gloss'
import { MenuItem, remote } from 'electron'
import React, { createContext, useState } from 'react'

export const ContextMenuContext = createContext<(items: MenuTemplate) => void>(null)

export type MenuTemplate = Partial<MenuItem>[]

export function ContextMenuProvider(props: { children: React.ReactNode }) {
  const [menuTemplate, setMenuTemplate] = useState([])

  const onContextMenu = () => {
    const menu = remote.Menu.buildFromTemplate(menuTemplate)
    setMenuTemplate([])
    menu.popup({ window: remote.getCurrentWindow() })
  }

  return (
    <ContextMenuContext.Provider
      value={(items: MenuTemplate) => {
        setMenuTemplate([...menuTemplate, ...items])
      }}
    >
      <Container onContextMenu={onContextMenu}>{props.children}</Container>
    </ContextMenuContext.Provider>
  )
}

const Container = gloss({
  display: 'contents',
})
