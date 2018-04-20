import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { Bit } from '@mcro/models'
import { GithubService } from '@mcro/services'
import Bits from '~/views/bits'

class GithubStore {
  get setting() {
    return this.props.appStore.settings.github
  }

  issues = Bit.find({ where: { integration: 'github', type: 'task' } })
  githubService = new GithubService(this.setting)
  active = 'repos'
  syncing = {}
  syncVersion = 0
  userOrgs = []

  get allOrgs() {
    return []
    // return (
    //   (App.services.Github.allOrgs &&
    //     App.services.Github.allOrgs.map(org => org.login)) ||
    //   []
    // )
  }

  onSync = async (repo, val) => {
    this.syncVersion++
    this.setting.values = {
      ...this.setting.values,
      repos: {
        ...this.setting.values.repos,
        [repo.fullName]: val,
      },
    }
    await this.setting.save()
  }

  isSyncing = repo => {
    if (!this.setting || !this.setting.values.repos) {
      return false
    }
    return this.setting.values.repos[repo.fullName] || false
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
    if (!store.issues) {
      return null
    }
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
          <Bits bits={store.issues} />
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
