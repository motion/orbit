import { loadMany, useModel } from '@o/bridge'
import { AppProps, Table, WhitelistManager } from '@o/kit'
import { AppModel, GithubRepositoryModel } from '@o/models'
import { CheckboxReactive, DateFormat, Text, View } from '@o/ui'
import { useStore } from '@o/use-store'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { SettingManageRow } from '../../views/SettingManageRow'

export default function GithubSettings({ subId }: AppProps) {
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
        <Table
          columns={{
            repo: {
              value: 'Repository',
            },
            org: {
              value: 'Organization',
            },
            lastCommit: {
              value: 'Last Commit',
            },
            numIssues: {
              value: 'Open Issues',
            },
            active: {
              value: 'Active',
            },
          }}
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
        />
      </View>
    </>
  )
}
