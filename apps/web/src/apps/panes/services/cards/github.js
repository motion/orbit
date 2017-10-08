import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { sortBy, reverse } from 'lodash'
import { Thing } from '~/app'
import CollapseArrow from '../collapseArrow'

@view.attach('githubStore')
@view
class Repo {
  render({ githubStore, repo }) {
    githubStore.syncVersion

    return (
      <container $$row>
        <left $$row>
          <UI.Field
            row
            size={1.2}
            type="toggle"
            onChange={val => {
              githubStore.onSync(repo, val)
            }}
            defaultValue={githubStore.isSyncing(repo)}
          />
          <repo>
            <UI.Title $repoTitle size={1.2}>
              {repo.name}
            </UI.Title>
            <info $$row>
              <UI.Text>last update</UI.Text>
              <UI.Date $updatedAt>{repo.updatedAt}</UI.Date>
            </info>
          </repo>
        </left>

        <syncers>
          <content if={githubStore.isSyncing(repo)} $$row>
            <UI.Text>
              <b>
                {
                  (githubStore.things || []).filter(
                    t =>
                      t.type === 'task' &&
                      t.orgName + '/' + t.parentId === repo.fullName
                  ).length
                }{' '}
                issues
              </b>
            </UI.Text>
          </content>
          <content if={false && githubStore.isSyncing(repo)} $$row>
            <feed $sync $$row>
              <UI.Title $syncTitle size={1.2}>
                Feed
              </UI.Title>
              <UI.Field row size={1.2} type="toggle" defaultValue={true} />
            </feed>
            <issues $sync $$row>
              <UI.Title $syncTitle size={1.2}>
                Issues
              </UI.Title>
              <UI.Field row size={1.2} type="toggle" defaultValue={true} />
            </issues>
          </content>
        </syncers>
      </container>
    )
  }

  static style = {
    container: {
      marginTop: 8,
      justifyContent: 'space-between',
    },
    repo: {
      minWidth: 250,
      marginLeft: 15,
    },
    sync: {
      marginLeft: 20,
      flexFlow: 'row',
      background: [0, 0, 0, 0.01],
      border: '1px solid rgba(0,0,0,.08)',
      padding: [0, 10],
      borderRadius: 3,
    },
    syncTitle: {
      marginRight: 10,
    },
    updatedAt: {
      marginLeft: 5,
    },
  }
}

@view({
  store: class ReposStore {
    showAll = false
  },
})
class Repos {
  render({ repos, store }) {
    const oneMonth = 2628000000
    const recent = store.showAll
      ? repos
      : repos.filter(r => +Date.now() - +new Date(r.updatedAt) < oneMonth * 2)

    return (
      <repos>
        {recent.map(repo => <Repo store={store} repo={repo} />)}
        <buttons $$row>
          <UI.Button
            if={repos.length !== recent.length}
            onClick={() => (store.showAll = true)}
            $add
            icon="simple-add"
          >
            show {repos.length - recent.length} more
          </UI.Button>
        </buttons>
      </repos>
    )
  }

  static style = {
    repos: {
      margin: 10,
    },
    buttons: {
      justifyContent: 'center',
    },
    add: {
      marginTop: 10,
    },
  }
}

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
          <CollapseArrow open={store.open} iconSize={18} />
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
            syncing {repos.filter(githubStore.isSyncing).length} /{' '}
            {store.repos.length} repos
          </UI.Title>
        </bar>
        <Repos if={store.open} repos={repos} />
      </org>
    )
  }

  static style = {
    org: {
      marginTop: 10,
    },
    bar: {
      alignItems: 'center',
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
    arrow: {
      transition: 'transform 100ms ease-in',
      marginRight: 7,
    },
    flip: {
      transform: { rotate: '90deg' },
    },
  }
}

class GithubStore {
  // org/repo: 'feed' 'issue' 'all'
  things = Thing.find()
  syncing = {}
  syncVersion = 0

  onSync = (repo, val) => {
    /*
    this.syncVersion += 1
    this.syncing = {
      ...this.syncing,
      [repo.fullName]: val,
    }
    */
    const { Github } = App.services

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
    return (
      <container>
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
