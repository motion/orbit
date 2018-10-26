import * as React from 'react'
import { SortableList } from '../../views/SortableList/SortableList'
import { view } from '@mcro/black'

class ListStore {
  items = [
    {
      id: 0,
      type: 'list',
      title: 'First List',
      subtitle: '10 items',
    },
  ]
}

@view.attach({
  store: ListStore,
})
@view
export class ListApp extends React.Component<{ store?: ListStore }> {
  render() {
    return <SortableList items={this.props.store.items} itemProps={{ direct: true }} />
  }
}
