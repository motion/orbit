import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Pane from '../pane'
import { Title } from '~/views'

@view
export default class PersonMain extends React.Component<Props> {
  render({ paneProps, result }) {
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
