import * as React from 'react'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import App from '~/app'

// cache it for speed
const CommitInfo = {}

@view({
  store: class CommitStore {
    @watch
    info = async () => {
      if (!App.services || !App.services.Github) {
        return null
      }
      const { sha } = this.props
      CommitInfo[sha] =
        CommitInfo[sha] ||
        (await App.services.Github.github
          .repos('motion', 'orbit')
          .commits(sha)
          .fetch())
      return CommitInfo[sha]
    }
  },
})
export default class Commit {
  render({ store }) {
    if (!store.info || !store.info.files) {
      return null
    }
    return (
      <UI.Card $commit>
        <pre>{store.info.files.map(file => file.patch)}</pre>
      </UI.Card>
    )
  }

  static style = {
    commit: {
      overflow: 'hidden',
    },
  }
}
