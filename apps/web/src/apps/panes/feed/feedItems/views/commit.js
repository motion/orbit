import * as React from 'react'
import { view } from '@mcro/black'
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
      <commit css={{ maxHeight: 400 }}>
        <pre>{store.info.files.map(file => file.patch)}</pre>
      </commit>
    )
  }
}
