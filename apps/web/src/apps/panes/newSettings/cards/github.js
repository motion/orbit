import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { sortBy, reverse } from 'lodash'

const repos = {
  tensorflow: ['cleverhans', 'tensorflow', 'tensorboard', 'haskell'],
  reactjs: ['react', 'react-rails', 'react-modal', 'react-transition-group'],
  motion: ['orbit', 'pundle', 'motion'],
}

@view({
  store: class RepoStore {
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
        {recent.map(repo => (
          <container $$row>
            <UI.Field row size={1.2} type="toggle" defaultValue={false} />
            <repo>
              <UI.Title $repoTitle size={1.2}>
                {repo.name}
              </UI.Title>
              <info $$row>
                <UI.Text>last modified</UI.Text>
                <UI.Date $updatedAt>{repo.updatedAt}</UI.Date>
              </info>
            </repo>
          </container>
        ))}
        <div $$row>
          <UI.Button
            if={repos.length !== recent.length}
            onClick={() => (store.showAll = true)}
            $add
            icon="simple-add"
          >
            show {repos.length - recent.length} more
          </UI.Button>
        </div>
      </repos>
    )
  }

  static style = {
    repos: {
      margin: 10,
    },
    repo: {
      marginLeft: 10,
    },
    updatedAt: {
      marginLeft: 5,
    },
    add: {
      marginTop: 5,
    },
  }
}

@view({
  store: class OrgStore {
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
  },
})
class Org {
  render({ store, name }) {
    const repos = reverse(sortBy(store.repos || [], 'updatedAt'))

    return (
      <org>
        <info $$row>
          <UI.Icon name="arrow-right" size={11} $arrow $flip={store.open} />

          <UI.Title size={1.3} onClick={() => (store.open = !store.open)}>
            {name}
          </UI.Title>
          <UI.Title if={store.repos} $repoCount size={1.3} opacity={0.5}>
            {store.repos.length} repos
          </UI.Title>
        </info>
        <Repos if={store.open} repos={repos} />
      </org>
    )
  }

  static style = {
    org: {
      marginTop: 10,
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

@view({
  store: class GithubStore {
    orgs = ['motion', 'reactjs']
    newOrg = null
    addOrg = () => {
      this.orgs = [...this.orgs, this.newOrg]
      this.newOrg = null
    }
  },
})
export default class Github {
  render({ store }) {
    return (
      <container>
        <orgs>{store.orgs.map(org => <Org name={org} />)}</orgs>
        <buttons $$row>
          <UI.Button
            icon="simple-add"
            if={store.newOrg === null}
            onClick={() => (store.newOrg = '')}
          >
            add org
          </UI.Button>
          <UI.Input
            if={store.newOrg !== null}
            autofocus
            value={store.newOrg}
            onKeyDown={e => {
              if (e.keyCode === 13) store.addOrg()
              if (e.keyCode === 27) store.newOrg = null
            }}
            onChange={e => (store.newOrg = e.target.value)}
          />
        </buttons>
      </container>
    )
  }

  static style = {
    orgs: {
      padding: 10,
    },
  }
}
