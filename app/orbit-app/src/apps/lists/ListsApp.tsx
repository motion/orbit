import * as React from 'react'
import { SortableList } from '../../views/SortableList/SortableList'
import { view } from '@mcro/black'

class ListsStore {
  lists = [
    {
      id: 0,
      index: 0,
      type: 'list',
      title: 'First List',
      subtitle: '10 items',
    },
  ]
}

@view.attach({
  store: ListsStore,
})
@view
export class ListsApp extends React.Component<{ store?: ListsStore }> {
  render() {
    return <SortableList items={this.props.store.lists} itemProps={{ direct: true }} />
  }
}
