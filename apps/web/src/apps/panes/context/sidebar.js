import * as React from 'react'
import * as UI from '@mcro/ui'
import { fuzzy } from '~/helpers'

export default class ContextSidebar {
  get search() {
    return this.props.homeStore.search
  }

  get results() {
    const context = this.props.homeStore.osContext
    if (context) {
      const { title } = context
      const os =
        this.props.homeStore.search.length === 0
          ? {
              category: 'Currently Viewing',
              children: <UI.Text opacity={0.7}>{title}</UI.Text>,
              after: <UI.Button icon="ui-1_bold-add" />,
            }
          : null
      return [os, ...this.props.homeStore.contextResults].filter(i => !!i)
    }
    return []
  }
}
