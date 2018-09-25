import { view } from '@mcro/black'
import { GithubRepositoryModel, GithubSetting as GithubSettingModel } from '@mcro/models'
import { GithubRepository } from '@mcro/services'
import { Text, View, Tabs, Tab, SearchableTable } from '@mcro/ui'
import * as React from 'react'
import { loadMany } from '@mcro/model-bridge'
import { DateFormat } from '../../../../views/DateFormat'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { HideablePane } from '../../views/HideablePane'
import { AppStatusPane } from './AppStatusPane'
import { SettingPaneProps } from './SettingPaneProps'
import { WhitelistManager } from './stores/WhitelistManager'
import { ManageSmartSync } from './views/ManageSmartSync'

class GithubSettingStore {
  props: SettingPaneProps & {
    setting: GithubSettingModel
  }
  repositories: GithubRepository[] = []
  active = 'status'
  userOrgs = []
  sortOrder = {
    key: 'lastCommit',
    direction: 'up',
  }
  whitelist = new WhitelistManager(this.props.setting)

  async didMount() {
    this.repositories = await loadMany(GithubRepositoryModel, {
      args: {
        settingId: this.props.setting.id,
      },
    })
  }

  willUnmount() {
    this.whitelist.dispose()
  }

  onSortOrder = newOrder => {
    this.sortOrder = newOrder
  }

  setActiveKey = key => {
    this.active = key
  }

  getAllFilterIds = () => {
    return this.repositories.map(repository => repository.nameWithOwner)
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
            <AppStatusPane setting={this.props.setting} />
          </HideablePane>
          <HideablePane invisible={store.active !== 'repos'}>
            <ManageSmartSync whitelist={store.whitelist} />
            <View
              flex={1}
              opacity={store.whitelist.isWhitelisting ? 0.5 : 1}
              pointerEvents={store.whitelist.isWhitelisting ? 'none' : 'auto'}
            >
              <SearchableTable
                virtual
                rowLineHeight={28}
                floating={false}
                columnSizes={{
                  repo: 'flex',
                  org: 'flex',
                  lastCommit: '20%',
                  numIssues: '17%',
                  active: '13%',
                }}
                columns={{
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
                }}
                // onRowHighlighted={this.onRowHighlighted}
                sortOrder={store.sortOrder}
                onSort={store.onSortOrder}
                multiHighlight
                rows={store.repositories.map(repository => {
                  const [orgName] = repository.nameWithOwner.split('/')
                  const lastCommit = new Date(repository.pushedAt)
                  const isActive = store.whitelist.whilistStatusGetter(repository.nameWithOwner)
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
                        sortValue: isActive,
                        value: (
                          <ReactiveCheckBox
                            onChange={store.whitelist.updateWhitelistValueSetter(
                              repository.nameWithOwner,
                              store.getAllFilterIds,
                            )}
                            isActive={isActive}
                          />
                        ),
                      },
                    },
                  }
                })}
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
