import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { sortBy, reverse } from 'lodash'
import App, { Thing } from '~/app'
import Things from '../../views/things'
import * as Collapse from '../../views/collapse'
import Repos from './repos'

class OrgStore {
  open = false
  repos = null

  get api() {
    return App.services.Github.github
  }

  async willMount() {
    const { items } = await this.api
      .orgs(this.props.name)
      .repos.fetch({ per_page: 100 })
    this.repos = items
  }
}
@view.attach('githubStore')
@view({
  store: OrgStore,
})
class Org {
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

class GithubStore {
  things = Thing.find()
  active = 'repos'
  syncing = {}
  syncVersion = 0

  get issues() {
    return (this.things || []).filter(t => t.type === 'task')
  }

  onSync = (repo, val) => {
    const { Github } = App.services
    this.syncVersion++
    Github.setting.mergeUpdate({
      values: {
        repos: {
          [repo.fullName]: val,
        },
      },
    })
  }

  isSyncing = repo => {
    const { Github } = App.services
    if (!Github.setting.values.repos) {
      return false
    }
    return Github.setting.values.repos[repo.fullName] || false
  }

  orgs = ['motion', 'reactjs']
  newOrg = ''
  addOrg = () => {
    this.orgs = [...this.orgs, this.newOrg]
    this.newOrg = ''
  }
}

@view.provide({ githubStore: GithubStore })
@view
export default class Github {
  render({ githubStore: store }) {
    const active = { background: 'rgba(0,0,0,0.15)' }

    return (
      <container>
        <UI.Row css={{ margin: [10, 0] }}>
          <UI.Button
            onClick={() => (store.active = 'repos')}
            color={[0, 0, 0, 0.8]}
            {...(store.active === 'repos' ? active : {})}
          >
            Repos
          </UI.Button>
          <UI.Button
            {...(store.active === 'issues' ? active : {})}
            onClick={() => (store.active = 'issues')}
            color={[0, 0, 0, 0.8]}
          >
            Issues ({store.issues.length})
          </UI.Button>
        </UI.Row>
        <repos if={store.active === 'repos'}>
          <orgs>{store.orgs.map(org => <Org name={org} />)}</orgs>
          <add>
            <UI.Input
              width={200}
              size={1}
              autofocus
              placeholder="Add Organization"
              value={store.newOrg}
              onKeyDown={e => {
                if (e.keyCode === 13) store.addOrg()
                if (e.keyCode === 27) store.newOrg = ''
              }}
              onChange={e => (store.newOrg = e.target.value)}
            />
          </add>
        </repos>
        <issues if={store.active === 'issues'}>
          <Things things={store.issues} />
        </issues>
      </container>
    )
  }

  static style = {
    add: {
      marginLeft: 15,
      marginTop: 15,
    },
  }
}
