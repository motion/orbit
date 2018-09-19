import { react, view } from '@mcro/black'
import {
  GithubRepository,
  GithubRepositoryModel,
  GithubSettingValues,
  SettingModel,
} from '@mcro/models'
import * as UI from '@mcro/ui'
import { Text } from '@mcro/ui'
import * as React from 'react'
import { loadMany, save } from '@mcro/model-bridge'
import { DateFormat } from '../../../../views/DateFormat'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { HideablePane } from '../../views/HideablePane'
import { AppStatusPane } from './AppStatusPane'
import { SettingPaneProps } from './SettingPaneProps'

const columnSizes = {
  repo: 'flex',
  org: 'flex',
  lastCommit: '20%',
  numIssues: '17%',
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
    value: 'Open Issues',
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
  repositories: GithubRepository[] = []

  active = 'status'
  userOrgs = []
  sortOrder = {
    key: 'lastCommit',
    direction: 'up',
  }

  get setting() {
    return this.props.setting
  }

  get values() {
    return this.setting.values as GithubSettingValues
  }

  onSortOrder = newOrder => {
    this.sortOrder = newOrder
  }

  rows = react(
    () => this.repositories,
    repositories => {
      return repositories.map(repository => {
        const [orgName] = repository.nameWithOwner.split('/')
        const lastCommit = new Date(repository.pushedAt)
        return {
          key: `${repository.id}`,
          columns: {
            org: {
              sortValue: orgName,
              value: orgName,
            },
            repo: {
              sortValue: repository.name,
              value: repository.name,
            },
            lastCommit: {
              sortValue: lastCommit.getTime(),
              value: (
                <Text ellipse>
                  <DateFormat date={lastCommit} />
                </Text>
              ),
            },
            numIssues: {
              sortValue: repository.issues.totalCount,
              value: repository.issues.totalCount,
            },
            active: {
              sortValue: this.whitelistStatus(repository),
              value: <ReactiveCheckBox onChange={this.changeWhitelist(repository)} isActive={this.whitelistStatus(repository)} />,
            },
          },
        }
      })
    },
    {
      defaultValue: [],
    },
  )

  setActiveKey = key => {
    this.active = key
  }

  toggleSyncAll = () => {

    // if sync all is already enable, register all repositories in whitelist
    if (this.values.whitelist === undefined) {
      this.values.whitelist = this.repositories.map(repository => repository.nameWithOwner)

    } else { // otherwise enable "sync all" mode
      this.values.whitelist = undefined
    }
    save(SettingModel, this.setting)
  }

  whitelistStatus = (repository: GithubRepository) => () => {

    // if whitelist is undefined we are in "sync all" mode
    if (this.values.whitelist === undefined)
      return true

    return this.values.whitelist.indexOf(repository.nameWithOwner) !== -1
  }

  isSyncAllEnabled = () => {
    return this.values.whitelist === undefined
  }

  changeWhitelist = (repository: GithubRepository) => () => {
    if (!this.values.whitelist) {
      this.values.whitelist = this.repositories
        .map(repository => repository.nameWithOwner)
    }

    const index = this.values.whitelist.indexOf(repository.nameWithOwner)
    if (index === -1) {
      this.values.whitelist.push(repository.nameWithOwner)
    } else {
      this.values.whitelist.splice(index, 1)
    }
    save(SettingModel, this.setting)
  }
}

@view.provide({ store: GithubSettingStore })
@view
export class GithubSetting extends React.Component<
  SettingPaneProps & { store: GithubSettingStore }
> {

  async componentDidMount() {
    this.props.store.repositories = await loadMany(GithubRepositoryModel, {
      args: {
        settingId: this.props.setting.id
      }
    })
  }

  render() {
    const { store, children } = this.props
    return children({
      belowHead: (
        <UI.Tabs active={store.active} onActive={store.setActiveKey}>
          <UI.Tab key="status" width="50%" label="Status" />
          <UI.Tab key="repos" width="50%" label="Manage" />
        </UI.Tabs>
      ),
      content: (
        <>
          <HideablePane invisible={store.active !== 'status'}>
            <AppStatusPane setting={store.setting} />
          </HideablePane>
          <HideablePane invisible={store.active !== 'repos'}>
            <div>
              <ReactiveCheckBox onChange={store.toggleSyncAll} isActive={store.isSyncAllEnabled} /> Sync all
            </div>
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
        </>
      ),
    })
  }
}
