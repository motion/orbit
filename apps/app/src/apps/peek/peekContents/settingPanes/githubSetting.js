import * as React from 'react'
import * as UI from '@mcro/ui'
import { view, react } from '@mcro/black'
import { Bit } from '@mcro/models'
import { Bits } from '~/views/bits'
import { Tabs, Tab, SearchableTable } from '@mcro/sonar'
import { TimeAgo } from '~/views/TimeAgo'
import * as _ from 'lodash'

@view
class CheckBox {
  render({ isActive, onChange }) {
    return (
      <input type="checkbox" onChange={onChange} defaultChecked={isActive()} />
    )
  }
  static style = {
    input: {
      margin: 'auto',
    },
  }
}

const columnSizes = {
  repo: 'flex',
  org: 'flex',
  lastCommit: '20%',
  numIssues: '12%',
  active: '10%',
}

const columns = {
  repo: {
    value: 'Repository',
    sortable: true,
    resizable: true,
  },
  org: {
    value: 'Organization',
    sortable: true,
    resizable: true,
  },
  lastCommit: {
    value: 'Last Commit',
    sortable: true,
    resizable: true,
  },
  numIssues: {
    value: 'Issues',
    sortable: true,
    resizable: true,
  },
  active: {
    value: 'Active',
    sortable: true,
  },
}

class GithubStore {
  get setting() {
    return this.props.appStore.settings.github
  }

  get service() {
    return this.props.appStore.services.github
  }

  issues = react(() =>
    Bit.find({ where: { integration: 'github', type: 'task' } }),
  )

  active = 'repos'
  syncing = {}
  userOrgs = []

  get orgsList() {
    const { allOrgs } = this.service
    return (allOrgs && allOrgs.map(org => org.login)) || []
  }

  allRepos = react(async () => {
    return _.flatten(
      await Promise.all(
        this.orgsList.map(async org => {
          return await this.service.github
            .orgs(org)
            .repos.fetch({ per_page: 100 })
            .then(res => res.items)
        }),
      ),
    )
  })

  rows = react(
    () => this.allRepos,
    repos => {
      log('react to all repos')
      return repos.map((repo, index) => {
        const orgName = repo.fullName.split('/')[0]
        const isActive = () => this.isSyncing(repo.fullName)
        return {
          key: `${repo.org}${repo.name}${index}`,
          columns: {
            org: {
              sortValue: orgName,
              value: orgName,
            },
            repo: {
              sortValue: repo.name,
              value: repo.name,
            },
            lastCommit: {
              sortValue: repo.pushedAt.getTime(),
              value: <TimeAgo>{repo.pushedAt}</TimeAgo>,
            },
            numIssues: {
              sortValue: repo.openIssuesCount,
              value: repo.openIssuesCount,
            },
            active: {
              sortValue: isActive,
              value: (
                <CheckBox
                  onChange={this.onSync(repo.fullName)}
                  isActive={isActive}
                />
              ),
            },
          },
        }
      })
    },
  )

  onSync = fullName => async e => {
    this.setting.values = {
      ...this.setting.values,
      repos: {
        ...this.setting.values.repos,
        [fullName]: e.target.checked,
      },
    }
    await this.setting.save()
  }

  isSyncing = fullName => {
    if (!this.setting || !this.setting.values.repos) {
      return false
    }
    return this.setting.values.repos[fullName] || false
  }

  newOrg = ''
  addOrg = () => {
    this.userOrgs = [...this.userOrgs, this.newOrg]
    this.newOrg = ''
  }
}

@view.provide({ githubStore: GithubStore })
@view
export class GithubSetting extends React.Component {
  render({ githubStore: store }) {
    return (
      <container>
        <Tabs active={store.active} onActive={key => (store.active = key)}>
          <Tab key="repos" width="50%" label="Repos" />
          <Tab
            key="issues"
            width="50%"
            label={`Issues (${store.issues ? store.issues.length : 0})`}
          />
        </Tabs>
        <section if={store.active === 'repos'}>
          <section>
            <SearchableTable
              if={store.rows}
              rowLineHeight={28}
              floating={false}
              multiline
              columnSizes={columnSizes}
              columns={columns}
              onRowHighlighted={this.onRowHighlighted}
              multiHighlight
              rows={store.rows}
            />
          </section>
          <add if={false}>
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
    container: {
      flex: 1,
    },
    section: {
      flex: 1,
    },
  }
}
