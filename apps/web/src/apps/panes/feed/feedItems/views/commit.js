import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import App from '~/app'

const CommitInfo = {}

@view({
  store: class CommitStore {
    info = null

    async willMount() {
      const { sha } = this.props
      CommitInfo[sha] =
        CommitInfo[sha] ||
        (await App.services.Github.github
          .repos('motion', 'orbit')
          .commits(sha)
          .fetch())
      this.info = CommitInfo[sha]
    }
  },
})
export default class Commit {
  render({ store }) {
    if (!store.info || !store.info.files) {
      return null
    }
    return (
      <UI.Card>
        <pre>{store.info.files.map(file => file.patch)}</pre>
      </UI.Card>
    )
  }

  static style = {
    commit: {
      border: [2, 'red'],
    },
  }
}
