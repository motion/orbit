// @flow
import React from 'react'
import { view } from '@mcro/black'
import InboxList from '~/views/inbox/list'

class BarNotificationsStore {
  results = []

  start() {
    this.props.getRef && this.props.getRef(this)
  }
}

@view({
  store: BarNotificationsStore,
})
export default class BarNotificationsPane {
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
