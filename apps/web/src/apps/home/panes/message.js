import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Pane from './pane'

class MessageSidebar {
  results = []
}

@view
class MessageMain extends React.Component<Props> {
  render({ data, paneProps }) {
    return (
      <Pane {...paneProps} light>
        <div $$fullscreen $$centered>
          123
          <UI.Title size={3} color="red">
            {data.message || 'no mesage'}
          </UI.Title>
        </div>
      </Pane>
    )
  }
}

export default {
  Sidebar: MessageSidebar,
  Main: MessageMain,
}
