import * as React from 'react'
import { SortableList } from '../../views/SortableList/SortableList'
import { view } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'

class ListsStore {
  lists = []

  async didMount() {
    this.lists = await loadMany(BitModel, { args: { take: 20 } })
  }
}

@view.attach({
  store: ListsStore,
})
@view
export class ListsApp extends React.Component<{ store?: ListsStore }> {
  render() {
    return <SortableList items={this.props.store.lists} />
  }
}
