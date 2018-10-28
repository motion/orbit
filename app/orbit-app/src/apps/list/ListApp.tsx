import * as React from 'react'
import { SortableList } from '../../views/SortableList/SortableList'
import { view, attach } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { Title } from '../../views'

class ListStore {
  lists = []

  async didMount() {
    this.lists = await loadMany(BitModel, { args: { take: 20 } })
  }
}

@attach({
  store: ListStore,
})
@view
export class ListApp extends React.Component<{ title?: string; store?: ListStore }> {
  render() {
    return (
      <>
        <Title>{this.props.title}</Title>
        <SortableList items={this.props.store.lists} />
      </>
    )
  }
}
