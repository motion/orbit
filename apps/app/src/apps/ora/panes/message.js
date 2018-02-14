import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Pane from './pane'

export class MessageSidebar {
  results = []
}

@view
export class MessageMain extends React.Component<Props> {
  render({ data, paneProps }) {
    return (
      <Pane {...paneProps}>
        <div $$fullscreen $$centered>
          <UI.Title size={3}>{(data && data.message) || 'no mesage'}</UI.Title>
        </div>
      </Pane>
    )
  }
}
