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
    return (
      <commit css={{ maxHeight: 200 }} if={store.info}>
        <pre>{store.info.files.map(file => file.patch)}</pre>
      </commit>
    )
  }
}
