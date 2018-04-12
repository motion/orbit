import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import App, { Thing } from '~/app'
import Things from '../views/things'

class GithubStore {
  things = Thing.find()
  active = 'repos'
  syncing = {}
  syncVersion = 0
  userOrgs = []

  get issues() {
    return (this.things || []).filter(t => t.type === 'task')
  }

  get allOrgs() {
    return (
      (App.services.Github.allOrgs &&
        App.services.Github.allOrgs.map(org => org.login)) ||
      []
    )
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
    if (!Github.setting || !Github.setting.values.repos) {
      return false
    }
    return Github.setting.values.repos[repo.fullName] || false
  }

  newOrg = ''
  addOrg = () => {
    this.userOrgs = [...this.userOrgs, this.newOrg]
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
          <orgs>{store.allOrgs.map(org => <Org key={org} name={org} />)}</orgs>
          <add>
            <UI.Input
              width={200}
              size={1}
              autoFocus
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
