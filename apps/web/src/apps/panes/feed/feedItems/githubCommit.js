import * as React from 'react'
import { view } from '@mcro/black'
import App from '~/app'

@view({
  store: class CommitStore {
    info = App.services.Github.github
      .repos('motion', 'orbit')
      .commits(this.props.sha)
      .fetch()
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
