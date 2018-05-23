import * as UI from '@mcro/ui'
import { view, react } from '@mcro/black'
import { sortBy, reverse } from 'lodash'
import { Bit } from '~/app'
import * as Collapse from '../views/collapse'
import Repos from './repos'

class OrgStore {
  open = false
  get api() {
    return GithubService.github
  }
  repos = react(
    () =>
      this.api &&
      this.api
        .orgs(this.props.name)
        .repos.fetch({ per_page: 100 })
        .then(res => res.items),
  )
}
@view.attach('githubStore')
@view({
  store: OrgStore,
})
export default class Org {
  render({ store, githubStore, name }) {
    const repos = reverse(sortBy(store.repos || [], 'updatedAt'))
    githubStore.syncVersion

    return (
      <org>
        <bar onClick={() => (store.open = !store.open)} $$row>
          <Collapse.Arrow open={store.open} iconSize={18} />
          <UI.Title size={1.2} fontWeight={500} css={{ userSelect: 'none' }}>
            {name}
          </UI.Title>
          <UI.Title
            if={store.repos}
            css={{ userSelect: 'none' }}
            $repoCount
            size={1.2}
            opacity={0.5}
          >
            syncing{' '}
            <b>
              {repos.filter(githubStore.isSyncing).length} /{' '}
              {store.repos.length}
            </b>{' '}
            repos
          </UI.Title>
        </bar>
        <Collapse.Body open={store.open}>
          <Repos repos={repos} />
        </Collapse.Body>
      </org>
    )
  }

  static style = {
    org: {
      marginTop: 10,
    },
    bar: {
      alignItems: 'center',
      userSelect: 'none',
    },
    repos: {
      padding: [5, 10],
    },
    repo: {
      margin: [5, 10],
    },
    repoCount: {
      marginLeft: 5,
    },
    info: {
      alignItems: 'center',
    },
    updatedAt: {
      marginLeft: 5,
    },
    toggle: {
      marginLeft: 10,
    },
  }
}
