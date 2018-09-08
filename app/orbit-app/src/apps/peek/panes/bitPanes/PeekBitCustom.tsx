import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekBitPaneProps } from './PeekBitPaneProps'
import { Sidebar, Row, SidebarLabel } from '@mcro/ui'

type Props = PeekBitPaneProps

const decorator = compose(view)

export const Custom = decorator(({ content }: Props) => {
  return (
    <Row flex={1}>
      <Sidebar minWidth={150} maxWidth={300} width={200} position="left">
        <SidebarLabel>test me</SidebarLabel>
        testing 123
      </Sidebar>
    </Row>
  )
})
