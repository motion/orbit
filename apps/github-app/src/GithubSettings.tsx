import { SettingManageRow, useApp, useAppState, useWhiteList } from '@o/kit'
import { DataType, Table, View } from '@o/ui'
import * as React from 'react'
import { useEffect } from 'react'

import { GithubLoader } from './GithubLoader'

export function GithubSettings() {
  const app = useApp()
  const [repos, setRepos] = useAppState(`${app.id}-repositories`, [])
  const whitelist = useWhiteList(`${app.id}-whitelist`, {
    getAll() {
      return (repos || []).map(repo => repo.nameWithOwner)
    },
  })

  // load and set repositories when app changes
  useEffect(() => {
    if (!app) return
    const loader = new GithubLoader(app)
    loader.loadUserRepositories().then(next => {
      setRepos(() => next)
    })
  }, [app && app.token])

  return (
    <>
      <SettingManageRow app={app} whitelist={whitelist} />
      <View
        flex={1}
        opacity={whitelist.isWhitelisting ? 0.5 : 1}
        pointerEvents={whitelist.isWhitelisting ? 'none' : 'inherit'}
      >
        <Table
          selectable="multi"
          columns={{
            repo: 'Repository',
            org: 'Organization',
            lastCommit: 'Last Commit',
            numIssues: 'Open Issues',
            active: {
              value: 'Active',
              type: DataType.boolean,
              onChange(index) {
                whitelist.toggleWhitelisted(repos[index].nameWithOwner)
              },
            },
          }}
          defaultSortOrder={{
            key: 'lastCommit',
            direction: 'up',
          }}
          items={(repos || []).map(repository => {
            const [orgName] = repository.nameWithOwner.split('/')
            return {
              org: orgName,
              repo: repository.name,
              lastCommit: new Date(repository.pushedAt),
              numIssues: repository.issues.totalCount,
              active: whitelist.getWhitelisted(repository.nameWithOwner),
            }
          })}
        />
      </View>
    </>
  )
}
