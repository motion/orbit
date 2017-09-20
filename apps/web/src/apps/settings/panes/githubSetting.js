// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import App from '~/app'

@view
export default class GithubSetting {
  render() {
    if (!App.services) {
      return null
    }

    const { Github } = App.services

    if (Github.orgs && Github.orgs.message) {
      console.warn('bad orgs')
      return null
    }

    return (
      <content>
        <loading
          if={!Github.orgs}
          css={{ height: 200, alignItems: 'center', justifyContent: 'center' }}
        >
          <UI.Icon size={40} name="loader_dots" opacity={0.5} />
        </loading>
        <settings if={Github.setting}>
          orgs selected: {JSON.stringify(Github.setting.values.orgs)}
        </settings>
        <UI.Form if={Github.orgs && Github.setting}>
          {Github.orgs.map(org => {
            const repos = Github.repos && Github.repos[org.id]
            const { orgs } = Github.setting.values
            const lower = x => `${x}`.toLowerCase()
            const orgActive = orgs && orgs[lower(org.login)]

            return (
              <field key={org.login}>
                <UI.Field
                  row
                  size={1.2}
                  label={org.login}
                  type="toggle"
                  defaultValue={orgActive}
                  onChange={val => {
                    Github.setting.mergeUpdate({
                      values: {
                        orgs: {
                          [lower(org.login)]: val,
                        },
                      },
                    })
                  }}
                />

                <repos if={repos && orgActive}>
                  {repos.map(repo => (
                    <UI.Field
                      key={repo.id}
                      row
                      label={repo.name}
                      type="checkbox"
                    />
                  ))}
                </repos>
              </field>
            )
          })}
        </UI.Form>
        <UI.Button onClick={() => CurrentUser.unlink('github')}>
          Unlink Github
        </UI.Button>
      </content>
    )
  }

  static style = {
    content: {
      flex: 1,
      overflowY: 'scroll',
      margin: [0, -20],
      padding: [0, 20],
    },
    field: {
      padding: [5, 0],
    },
  }
}
