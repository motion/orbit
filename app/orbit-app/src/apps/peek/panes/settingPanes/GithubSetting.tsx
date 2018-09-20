import { react, view } from '@mcro/black'
import produce from 'immer'
import { GithubRepositoryModel, GithubSettingValues, SettingModel } from '@mcro/models'
import { GithubRepository } from '@mcro/services'
import { Text, Row, View, Tabs, Tab, SearchableTable } from '@mcro/ui'
import * as React from 'react'
import { loadMany, save } from '@mcro/model-bridge'
import { DateFormat } from '../../../../views/DateFormat'
import { ReactiveCheckBox, CheckBox } from '../../../../views/ReactiveCheckBox'
import { HideablePane } from '../../views/HideablePane'
import { AppStatusPane } from './AppStatusPane'
import { SettingPaneProps } from './SettingPaneProps'
import { HorizontalSpace } from '../../../../views'

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

  async didMount() {
    this.repositories = await loadMany(GithubRepositoryModel, {
      args: {
        settingId: this.props.setting.id,
      },
    })
  }

  get setting() {
    return this.props.setting
  }

  values = { ...this.setting.values } as GithubSettingValues

  saveSettingOnValuesUpdate = react(
    () => this.values,
    values => {
      console.log('saving values...', values)
      this.setting.values = values
      save(SettingModel, this.setting)
    },
  )

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
              value: (
                <ReactiveCheckBox
                  onChange={this.changeWhitelist(repository)}
                  isActive={this.whitelistStatus(repository)}
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

  setActiveKey = key => {
    this.active = key
  }

  toggleSyncAll = () => {
    this.values = produce(this.values, values => {
      // if sync all is already enable, register all repositories in whitelist
      if (values.whitelist === undefined) {
        values.whitelist = this.repositories.map(repository => repository.nameWithOwner)
      } else {
        // otherwise enable "sync all" mode
        values.whitelist = undefined
      }
    })
  }

  whitelistStatus = (repository: GithubRepository) => () => {
    // if whitelist is undefined we are in "sync all" mode
    if (this.values.whitelist === undefined) {
      return true
    }
    return this.values.whitelist.indexOf(repository.nameWithOwner) !== -1
  }

  get isSyncAllEnabled() {
    return this.values.whitelist === undefined
  }

  changeWhitelist = (repository: GithubRepository) => () => {
    this.values = produce(this.values, values => {
      if (!values.whitelist) {
        values.whitelist = this.repositories.map(repository => repository.nameWithOwner)
      }
      const index = values.whitelist.indexOf(repository.nameWithOwner)
      if (index === -1) {
        values.whitelist.push(repository.nameWithOwner)
      } else {
        values.whitelist.splice(index, 1)
      }
    })
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
        <Tabs active={store.active} onActive={store.setActiveKey}>
          <Tab key="status" width="50%" label="Status" />
          <Tab key="repos" width="50%" label="Manage" />
        </Tabs>
      ),
      content: (
        <>
          <HideablePane invisible={store.active !== 'status'}>
            <AppStatusPane setting={store.setting} />
          </HideablePane>
          <HideablePane invisible={store.active !== 'repos'}>
            <Row padding={[6, 15]}>
              <View flex={1} />
              <Text>Sync all</Text>
              <HorizontalSpace />
              <CheckBox onChange={store.toggleSyncAll} checked={store.isSyncAllEnabled} />
            </Row>
            <View
              flex={1}
              opacity={store.isSyncAllEnabled ? 0.5 : 1}
              pointerEvents={store.isSyncAllEnabled ? 'none' : 'auto'}
            >
              <SearchableTable
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
                    <Text size={1.2}>Loading...</Text>
                  </div>
                }
              />
            </View>
          </HideablePane>
        </>
      ),
    })
  }
}
