import * as React from 'react'
import * as UI from '@mcro/ui'
import { view, react } from '@mcro/black'
import { BitRepository, SettingRepository } from '../../../../repositories'
import { Bits } from '../../../../views/Bits'
import { TimeAgo } from '../../../../views/TimeAgo'
import * as _ from 'lodash'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { SettingPaneProps } from './SettingPaneProps'
import { HideablePane } from '../../views/HideablePane'

const columnSizes = {
  repo: 'flex',
  org: 'flex',
  lastCommit: '20%',
  numIssues: '13%',
  active: '13%',
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

class GithubSettingStore {
  props: SettingPaneProps

  active = 'repos'
  userOrgs = []
  sortOrder = {
    key: 'lastCommit',
    direction: 'up',
  }

  get setting() {
    return this.props.setting
  }

  get service() {
    return this.props.appStore.services.github
  }

  bits = react(() =>
    BitRepository.find({ where: { integration: 'github', type: 'task' } }),
  )

  get orgsList() {
    const { allOrgs } = this.service
    return (allOrgs && allOrgs.map(org => org.login)) || []
  }

  onSortOrder = newOrder => {
    this.sortOrder = newOrder
  }

  allRepos = react(
    async () => {
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
    },
    {
      defaultValue: [],
    },
  )

  rows = react(
    () => this.allRepos,
    repos => {
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
                <ReactiveCheckBox
                  onChange={this.onSync(repo.fullName)}
                  isActive={isActive}
                />
              ),
            },
          },
        }
      })
    },
    {
      defaultValue: [],
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
    // await this.setting.save()
    SettingRepository.save(this.setting)
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

  setActiveKey = key => {
    this.active = key
  }
}

@view.provide({ store: GithubSettingStore })
@view
export class GithubSetting extends React.Component<
  SettingPaneProps & { store: GithubSettingStore }
> {
  render() {
    const { store, children } = this.props
    return children({
      belowHead: (
        <UI.Tabs active={store.active} onActive={store.setActiveKey}>
          <UI.Tab key="repos" width="50%" label="Repos" />
          <UI.Tab
            key="issues"
            width="50%"
            label={`Issues (${store.bits ? store.bits.length : 0})`}
          />
        </UI.Tabs>
      ),
      content: (
        <>
          <HideablePane invisible={store.active !== 'repos'}>
            <UI.SearchableTable
              virtual
              rowLineHeight={28}
              floating={false}
              columnSizes={columnSizes}
              columns={columns}
              // onRowHighlighted={this.onRowHighlighted}
              sortOrder={store.sortOrder}
              onSort={store.onSortOrder}
              multiHighlight
              rows={store.rows}
              bodyPlaceholder={
                <div style={{ margin: 'auto' }}>
                  <UI.Text size={1.2}>Loading...</UI.Text>
                </div>
              }
            />
          </HideablePane>
          <HideablePane invisible={store.active !== 'issues'}>
            <Bits bits={store.bits} />
          </HideablePane>
        </>
      ),
    })
  }
}
