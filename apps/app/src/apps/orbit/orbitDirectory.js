import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Person } from '@mcro/models'

class OrbitDirectoryStore {
  @react({ immediate: true })
  setGetResults = [
    () => this.props.isActive,
    () => {
      this.props.appStore.setGetResults(() => this.results)
    },
  ]

  @react({
    defaultValue: [],
  })
  results = async () => {
    return await Person.find({ take: 30 })
  }
}

@UI.injectTheme
@view({
  store: OrbitDirectoryStore,
})
export default class OrbitDirectory {
  render({ store, theme }) {
    return (
      <directory css={{ background: theme.base.background }}>
        directory
      </directory>
    )
  }

  static style = {
    directory: {
      flex: 1,
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
      padding: [0, 8],
    },
  }
}
