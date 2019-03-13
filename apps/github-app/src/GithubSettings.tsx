import { loadMany } from '@o/bridge'
import { AppProps, SettingManageRow, Table, useApp, WhitelistManager } from '@o/kit'
import { GithubRepositoryModel } from '@o/models'
import { DataType, View } from '@o/ui'
import { useStore } from '@o/use-store'
import * as React from 'react'
import { useEffect, useState } from 'react'

export default function GithubSettings({ subId }: AppProps) {
  const [app, updateApp] = useApp(+subId)
  const whitelist = useStore(WhitelistManager, {
    app,
    getAll: () => (repositories || []).map(repository => repository.nameWithOwner),
  })
  // setup state
  const [repositories, setRepositories] = useState(null)

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
              type: DataType.date,
            },
            numIssues: {
              value: 'Open Issues',
              type: DataType.number,
            },
            active: {
              value: 'Active',
              type: DataType.boolean,
              onChange(index) {
                whitelist.toggleWhitelisted(repositories[index].nameWithOwner)
              },
            },
          }}
          defaultSortOrder={{
            key: 'lastCommit',
            direction: 'up',
          }}
          multiHighlight
          rows={(repositories || []).map(repository => {
            const [orgName] = repository.nameWithOwner.split('/')
            return {
              key: `${repository.id}`,
              values: {
                org: orgName,
                repo: repository.name,
                lastCommit: new Date(repository.pushedAt),
                numIssues: repository.issues.totalCount,
                active: whitelist.getWhitelisted(repository.nameWithOwner),
              },
            }
          })}
        />
      </View>
    </>
  )
}
