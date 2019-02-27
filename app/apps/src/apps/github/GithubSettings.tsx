import { loadMany, useModel } from '@mcro/bridge'
import { AppProps, WhitelistManager } from '@mcro/kit'
import { AppModel, GithubRepositoryModel } from '@mcro/models'
import { CheckboxReactive, DateFormat, SearchableTable, Text, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SettingManageRow } from '../../views/SettingManageRow'

export default function GithubSettings(props: AppProps) {
  const { subId } = props.appConfig
  const [app, updateApp] = useModel(AppModel, { where: { id: +subId } })
  const whitelist = useStore(WhitelistManager, {
    app,
    getAll: () => (repositories || []).map(repository => repository.nameWithOwner),
  })
  // setup state
  const [repositories, setRepositories] = useState(null)
  // console.log('repositories', repositories)
  const [sortOrder, setSortOrder] = useState({
    key: 'lastCommit',
    direction: 'up',
  })

  // load and set repositories when app changes
  useEffect(
    () => {
      if (!app) return
      // for some reason we can get any app here, so filter out everything except github
      if (app.identifier !== 'github') return
      // console.log(app)

      // if we have repositories stored in the app - use them at first
      if (app.data.repositories) {
        // console.log(`set repositories from app`, app.data.repositories)
        setRepositories(app.data.repositories)
      }

      // to make sure we always have a fresh repositories we load them form API
      loadMany(GithubRepositoryModel, {
        args: {
          appId: app.id,
        },
      }).then(freshApiRepositories => {
        // console.log(`loaded repositories from remote`, freshApiRepositories)

        // we check if api repositories are changed
        const appRepositories = app.data.repositories
        if (
          !freshApiRepositories ||
          JSON.stringify(appRepositories) === JSON.stringify(freshApiRepositories)
        )
          return

        // console.log(`repositories changed, updating`)

        // then we update app data in the db
        setRepositories(freshApiRepositories)
        app.data = {
          ...app.data,
          repositories: freshApiRepositories,
        }
        updateApp(app)
      })
    },
    [app && app.id],
  )

  return (
    <>
      <SettingManageRow app={app} whitelist={whitelist} />
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
                    <CheckboxReactive
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
