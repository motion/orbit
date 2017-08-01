// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import fuzzy from 'fuzzy'

class BarFeedStore {
  get results() {
    const hayStack = [{ title: 'Item 1' }]
    return fuzzy
      .filter(this.props.search, hayStack, {
        extract: el => el.title,
        pre: '<',
        post: '>',
      })
      .map(item => item.original)
      .filter(x => !!x)
  }
}

@view({
  store: BarFeedStore,
})
export default class BarFeed {
  render({ store, isActive, highlightIndex, itemProps }) {
    return (
      <feed>
        <item>
          <avatar>
            <img src="/images/me.jpg" />
          </avatar>
          <meta>
            <name>Nate</name>
            <action>edited</action>
            <date>2m ago</date>
          </meta>
          <content>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </content>
        </item>
      </feed>
    )
  }
}
