import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Pane from './pane'
import Calendar from './feed/calendar'
import { Title } from '~/views'

class PersonSidebar {
  results = []
}

@view
class PersonMain extends React.Component<Props> {
  render({ paneProps, result }) {
    const icon = result.icon.props.src

    return (
      <Pane
        {...paneProps}
        items={[
          () => (
            <header css={{ padding: 20 }}>
              <Title>{result.title}</Title>
            </header>
          ),
          () => <Calendar labels={[]} />,
        ]}
      />
    )
  }
}

export default {
  Sidebar: PersonSidebar,
  Main: PersonMain,
}
