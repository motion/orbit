// @flow
import React from 'react'
import { view } from '@mcro/black'
import InboxList from '~/views/inbox/list'

class BarMainStore {
  items = []

  setInboxItems = items => {
    this.items = items
  }
}

@view({
  store: BarMainStore,
})
export default class BarMainPane {
  render({ store, isActive, highlightIndex, itemProps }) {
    return (
      <InboxList
        controlled={isActive}
        isSelected={(item, index) => index === highlightIndex}
        getItems={store.setInboxItems}
        filter={store.value}
        itemProps={{
          ...itemProps,
        }}
      />
    )
  }
}
