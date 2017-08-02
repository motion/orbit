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
  getLength = () => this.props.store.results.length

  render({ store, onRef, activeIndex }) {
    onRef(this)
    return (
      <InboxList
        controlled={false}
        listProps={{ selected: activeIndex }}
        getItems={store.ref('results').set}
        filter={store.value}
      />
    )
  }
}
