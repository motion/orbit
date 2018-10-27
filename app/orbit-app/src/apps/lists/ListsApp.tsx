import * as React from 'react'
import { SortableList } from '../../views/SortableList/SortableList'
import { view } from '@mcro/black'

class ListsStore {
  state = Math.random()
  lists = [
    {
      id: 0,
      index: 0,
      type: 'list',
      title: 'First List',
      subtitle: '10 items',
    },
    {
      id: 1,
      index: 1,
      type: 'list',
      title: 'Next list',
      subtitle: '3 items',
    },
    {
      id: 2,
      index: 2,
      type: 'list',
      title: 'Third list',
      subtitle: '34 items',
    },
    {
      id: 3,
      index: 3,
      type: 'list',
      title: 'Items I Really Like',
      subtitle: '100 items',
    },
    {
      id: 4,
      index: 4,
      type: 'list',
      title: 'Another Another List',
      subtitle: '1 items',
    },
  ]
}

@view.attach({
  store: ListsStore,
})
@view
export class ListsApp extends React.Component<{ store?: ListsStore }> {
  render() {
    console.log('----------------', this.props.store.state)
    return (
      <>
        <SortableList items={this.props.store.lists} itemProps={{ direct: true }} />
      </>
    )
  }
}
