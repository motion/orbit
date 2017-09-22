import { view } from '@mcro/black'
import * as Pane from '~/apps/panes/pane'
import * as React from 'react'

@view({
  store: class DocsStore {},
})
export default class DocsStore {
  render({ store }) {
    return (
      <Pane.Card
        items={[
          {
            view: () => <h1>docs are here</h1>,
          },
        ]}
      />
    )
  }
}
