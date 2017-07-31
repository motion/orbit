// @flow
import React from 'react'
import { view } from '@mcro/black'
import InboxList from '~/views/inbox/list'

class BarMainStore {
  results = []

  start() {
    this.props.getRef && this.props.getRef(this)
  }
}

@view({
  store: BarMainStore,
})
export default class BarMainPane {
  render({ store, isActive, highlightIndex }) {
    return (
      <InboxList
        controlled={isActive}
        isSelected={(item, index) => index === highlightIndex}
        getItems={store.ref('results').set}
        filter={store.value}
      />
    )
  }
}
