import * as UI from '@mcro/ui'
import { view, react } from '@mcro/black'
import { Bit } from '@mcro/models'
import { GithubService } from '@mcro/services'
import { Bits } from '~/views/bits'
import { Tabs, Tab, SearchableTable } from '@mcro/sonar'
import { TimeAgo } from '~/views/TimeAgo'

const columnSizes = {
  org: 'flex',
  repo: '30%',
  lastCommit: '20%',
  numIssues: '10%',
}

const columns = {
  org: {
    value: 'Organization',
  },
  repo: {
    value: 'Repository',
  },
  lastCommit: {
    value: 'Last Commit',
  },
  numIssues: {
    value: '# Issues',
  },
}

class GithubStore {
  get setting() {
    return this.props.appStore.settings.github
  }

  issues = react(() =>
    Bit.find({ where: { integration: 'github', type: 'task' } }),
  )

  service = new GithubService(this.setting)
  active = 'repos'
  syncing = {}
  syncVersion = 0
  userOrgs = []

  get orgsList() {
    const { allOrgs } = this.service
    return (allOrgs && allOrgs.map(org => org.login)) || []
  }

  allRepos = react(async () => {
    let repos = []
    // TODO can make parallel
    for (const org of this.orgsList) {
      const newRepos = await this.service.github
        .orgs(org)
        .repos.fetch({ per_page: 100 })
        .then(res => res.items.map(i => ({ ...i, org })))
      repos = [...repos, ...newRepos]
    }
    return repos
  })

  rows = react(
    () => this.allRepos,
    repos => {
      return repos.map((repo, index) => {
        console.log('repo', repo)
        return {
          key: `${repo.org}${repo.name}${index}`,
          columns: {
            org: {
              value: repo.org,
            },
            repo: {
              value: repo.name,
            },
            lastCommit: {
              value: <TimeAgo>{repo.pushedAt}</TimeAgo>,
            },
            numIssues: {
              value: repo.openIssuesCount,
            },
          },
        }
      })
    },
  )

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
export class GithubSetting {
  render({ githubStore: store }) {
    if (!store.issues) {
      return <div>no issues</div>
    }
    return (
      <container>
        <Tabs active={store.active} onActive={key => (store.active = key)}>
          <Tab key="repos" width="50%" label="Repos" />
          <Tab
            key="issues"
            width="50%"
            label={`Issues (${store.issues.length})`}
          />
        </Tabs>

        <section if={store.active === 'repos'}>
          <section>
            <SearchableTable
              if={store.rows}
              rowLineHeight={28}
              floating={false}
              autoHeight
              multiline
              columnSizes={columnSizes}
              columns={columns}
              onRowHighlighted={this.onRowHighlighted}
              multiHighlight
              rows={store.rows}
              stickyBottom
              actions={<button onClick={this.clear}>Clear Table</button>}
            />
          </section>
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
        </section>
        <section if={store.active === 'issues'}>
          <Bits bits={store.section} />
        </section>
      </container>
    )
  }

  static style = {
    add: {
      marginLeft: 15,
      marginTop: 15,
    },
    section: {
      flex: 1,
    },
  }
}
