import { GithubRepositoryModel, GithubSource } from '@mcro/models'
import { GithubRepository } from '@mcro/services'
import { Text, View, SearchableTable, Tabs, Tab } from '@mcro/ui'
import * as React from 'react'
import { loadMany } from '@mcro/model-bridge'
import { DateFormat } from '../../../../views/DateFormat'
import ReactiveCheckBox from '../../../../views/ReactiveCheckBox'
import { OrbitSourceSettingProps } from '../../../types'
import { WhitelistManager } from '../../../helpers/WhitelistManager'
import { SettingManageRow } from '../../../views/settings/SettingManageRow'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'

type Props = OrbitSourceSettingProps<GithubSource>

class GithubSettingStore {
  props: Props
  repositories: GithubRepository[] = null
  userOrgs = []
  sortOrder = {
    key: 'lastCommit',
    direction: 'up',
  }
  whitelist = new WhitelistManager({
    source: this.props.source,
    getAll: this.getAllFilterIds.bind(this),
  })

  async didMount() {
    this.repositories =
      (await loadMany(GithubRepositoryModel, {
        args: {
          sourceId: this.props.source.id,
        },
      })) || []
  }

  willUnmount() {
    this.whitelist.dispose()
  }

  onSortOrder = newOrder => {
    this.sortOrder = newOrder
  }

  private getAllFilterIds() {
    return (this.repositories || []).map(repository => repository.nameWithOwner)
  }
}

export default observer(function GithubSettings(props: Props) {
  const store = useStore(GithubSettingStore, props)
  return (
    <>
      <SettingManageRow source={props.source} whitelist={store.whitelist} />
      <View
        flex={1}
        opacity={store.whitelist.isWhitelisting ? 0.5 : 1}
        pointerEvents={store.whitelist.isWhitelisting ? 'none' : 'inherit'}
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
          rows={(store.repositories || []).map(repository => {
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
              <Text size={1.2}>{store.repositories ? 'No repositories found' : 'Loading...'}</Text>
            </div>
          }
        />
      </View>
    </>
  )
})
