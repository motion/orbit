// @flow
import React from 'react'
import { view } from '@mcro/black'
import InboxList from '~/views/inbox/list'

class BarThreadsStore {
  results = []

  start() {
    this.props.getRef && this.props.getRef(this)
  }
}

@view({
  store: BarThreadsStore,
})
export default class BarThreadsPane {
  render({ store, activeItem, isActive, highlightIndex }) {
    console.log('active item is', activeItem)
    return (
      <threads>
        <InboxList
          document={activeItem.doc}
          controlled={isActive}
          isSelected={(item, index) => index === highlightIndex}
          getItems={store.ref('results').set}
          filter={store.value}
        />
      </threads>
    )
  }
}
