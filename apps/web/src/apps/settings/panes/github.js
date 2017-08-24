// @flow
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Setting } from '~/app'

type GithubOrg = {
  login: string,
  id: number,
  url: string,
  repos_url: string,
  avatar_url: string,
  description: string,
}

type GithubRepo = {
  id: number,
  owner: Object,
  name: string,
  url: string,
  default_branch: string,
  permissions: Object,
  created_at: string,
  updated_at: string,
}

type Props = {
  store: GithubSettingStore,
}

@view({
  store: class GithubSettingStore {
    orgs: Array<GithubOrg> = null
    setting: Setting = Setting.findOne({
      type: 'github',
      userId: CurrentUser.id,
    })

    @watch
    allRepos = () =>
      this.orgs &&
      Promise.all(
        this.orgs.map(org =>
          this.fetch(`/orgs/${org.login.toLowerCase()}/repos`)
        )
      )

    get repos(): Object<string, GithubRepo> {
      if (!this.allRepos) {
        return null
      }
      return this.orgs.reduce(
        (acc, org, index) => ({
          ...acc,
          [org.id]: this.allRepos[index],
        }),
        {}
      )
    }

    get token() {
      return this.props.integration.auth.accessToken
    }

    async start() {
      this.orgs = await this.fetch('/user/orgs')
    }

    fetch = (path, options) =>
      fetch(
        `https://api.github.com${path}?access_token=${this.token}`,
        options
      ).then(res => res.json())
  },
})
export default class GithubSetting {
  render({ store }: Props) {
    return (
      <content>
        <loading
          if={!store.orgs}
          css={{ height: 200, alignItems: 'center', justifyContent: 'center' }}
        >
          <UI.Icon size={40} name="loader_dots" opacity={0.5} />
        </loading>

        <settings if={store.setting}>
          setting values: {JSON.stringify(store.setting.values)}
        </settings>

        <UI.Form if={store.orgs}>
          {store.orgs.map(org => {
            const repos = store.repos && store.repos[org.id]
            const { orgs } = store.setting.values
            const orgActive = orgs && orgs[org.id]

            return (
              <field key={org.id}>
                <UI.Field
                  row
                  size={1.2}
                  label={org.login}
                  type="toggle"
                  defaultValue={orgActive}
                  onChange={val => {
                    store.setting.values = {
                      ...store.setting.values,
                      orgs: {
                        ...orgs,
                        [org.login]: val,
                      },
                    }
                    console.log('settings.values is', store.setting.values)
                    store.setting.save()
                  }}
                />

                <repos if={repos && orgActive}>
                  {repos.map(repo =>
                    <UI.Field
                      key={repo.id}
                      row
                      label={repo.name}
                      type="checkbox"
                    />
                  )}
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
