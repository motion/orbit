import * as React from 'react'
import { SortableList } from '../../views/SortableList/SortableList'
import { view } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'

class ListStore {
  results = []

  async didMount() {
    this.results = await loadMany(BitModel, { args: { take: 20 } })
  }
}

@view.attach({
  store: ListStore,
})
@view
export class ListApp extends React.Component<{ store?: ListStore }> {
  render() {
    return <SortableList items={this.props.store.results} />
  }
}
