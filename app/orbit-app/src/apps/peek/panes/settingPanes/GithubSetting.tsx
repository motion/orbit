import { view } from '@mcro/black'
import { GithubRepositoryModel, GithubSetting as GithubSettingModel } from '@mcro/models'
import { GithubRepository } from '@mcro/services'
import { Text, View, SearchableTable } from '@mcro/ui'
import * as React from 'react'
import { loadMany } from '@mcro/model-bridge'
import { DateFormat } from '../../../../views/DateFormat'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { HideablePane } from '../../views/HideablePane'
import { WhitelistManager } from './stores/WhitelistManager'
import { PeekContent } from '../../views/PeekContent'
import { SettingManageRow } from './views/SettingManageRow'
import { PeekSettingHeader } from './views/PeekSettingHeader'
import { AppTopicExplorer } from './views/AppTopicExplorer'
import { PeekSettingProps } from '../PeekSetting'

type Props = PeekSettingProps<GithubSettingModel>

class GithubSettingStore {
  props: Props
  repositories: GithubRepository[] = []
  userOrgs = []
  sortOrder = {
    key: 'lastCommit',
    direction: 'up',
  }
  whitelist = new WhitelistManager({
    setting: this.props.setting,
    getAll: this.getAllFilterIds.bind(this),
  })

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

  private getAllFilterIds() {
    return this.repositories.map(repository => repository.nameWithOwner)
  }
}

@view.provide({ store: GithubSettingStore })
@view
export class GithubSetting extends React.Component<Props & { store: GithubSettingStore }> {
  render() {
    const { store, appViewStore, setting } = this.props
    return (
      <>
        <PeekSettingHeader
          setting={setting}
          onClickSettings={appViewStore.activeToggler('settings')}
          settingsActive={appViewStore.active === 'settings'}
        />
        <PeekContent>
          <HideablePane invisible={appViewStore.active === 'settings'}>
            <AppTopicExplorer setting={setting} />
          </HideablePane>
          <HideablePane invisible={appViewStore.active !== 'settings'}>
            <SettingManageRow store={store} setting={setting} />
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
        </PeekContent>
      </>
    )
  }
}
