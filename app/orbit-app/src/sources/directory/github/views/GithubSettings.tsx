import { GithubRepositoryModel, GithubSource } from '@mcro/models'
import { SearchableTable, Text, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { loadMany } from '../../../../mediator'
import { DateFormat } from '../../../../views/DateFormat'
import ReactiveCheckBox from '../../../../views/ReactiveCheckBox'
import { WhitelistManager } from '../../../helpers/WhitelistManager'
import { OrbitSourceSettingProps } from '../../../types'
import { SettingManageRow } from '../../../views/settings/SettingManageRow'

export default function GithubSettings({ source }: OrbitSourceSettingProps<GithubSource>) {
  const whitelist = useStore(WhitelistManager, {
    source,
    getAll: () => (repositories || []).map(repository => repository.nameWithOwner),
  }) as WhitelistManager<GithubSource>
  // setup state
  const [repositories, setRepositories] = useState(null)
  // console.log('repositories', repositories)
  const [sortOrder, setSortOrder] = useState({
    key: 'lastCommit',
    direction: 'up',
  })

  // load and set repositories when source changes
  useEffect(
    () => {
      // for some reason we can get any source here, so filter out everything except github
      if (source.type !== 'github') return

      // if we have repositories stored in the source - use them at first
      if (source.data.repositories) {
        // console.log(`set repositories from source`, source.data.repositories)
        setRepositories(source.data.repositories)
      }

      // to make sure we always have a fresh repositories we load them form API
      loadMany(GithubRepositoryModel, {
        args: {
          sourceId: source.id,
        },
      }).then(freshApiRepositories => {
        // console.log(`loaded repositories from remote`, freshApiRepositories)

        // we check if api repositories are changed
        const sourceRepositories = source.data.repositories
        if (
          !freshApiRepositories ||
          JSON.stringify(sourceRepositories) === JSON.stringify(freshApiRepositories)
        )
          return

        // console.log(`repositories changed, updating`)

        // then we update source data in the db
        setRepositories(freshApiRepositories)
        source.data = {
          ...source.data,
          repositories: freshApiRepositories,
        }
        // TODO @umed commented out because this is deleting spaces property
        // save(SourceModel, {
        //   id: source.id,
        //   data: source.data
        // })
      })
    },
    [source.id],
  )

  return (
    <>
      <SettingManageRow source={source} whitelist={whitelist} />
      <View
        flex={1}
        opacity={whitelist.isWhitelisting ? 0.5 : 1}
        pointerEvents={whitelist.isWhitelisting ? 'none' : 'inherit'}
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
          sortOrder={sortOrder}
          onSort={setSortOrder}
          multiHighlight
          rows={(repositories || []).map(repository => {
            const [orgName] = repository.nameWithOwner.split('/')
            const lastCommit = new Date(repository.pushedAt)
            const isActive = whitelist.whilistStatusGetter(repository.nameWithOwner)
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
                      onChange={whitelist.updateWhitelistValueSetter(repository.nameWithOwner)}
                      isActive={isActive}
                    />
                  ),
                },
              },
            }
          })}
          bodyPlaceholder={
            <div style={{ margin: 'auto' }}>
              <Text size={1.2}>{repositories ? 'No repositories found' : 'Loading...'}</Text>
            </div>
          }
        />
      </View>
    </>
  )
}
