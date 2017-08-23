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
  owner: object,
  name: string,
  url: string,
  default_branch: string,
  permissions: object,
  created_at: string,
  updated_at: string,
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
  render({ store }) {
    return (
      <githubSettings>
        <loading
          if={!store.orgs}
          css={{ height: 200, alignItems: 'center', justifyContent: 'center' }}
        >
          <UI.Icon size={40} name="loader_dots" opacity={0.5} />
        </loading>

        <settings if={store.setting}>
          setting values: {JSON.stringify(store.setting.values)}
          repos: {JSON.stringify(store.repos)}
        </settings>

        <UI.Form if={store.orgs}>
          {store.orgs.map(org =>
            <field key={org.id}>
              <UI.Field
                row
                size={1.2}
                label={org.login}
                type="toggle"
                defaultValue={
                  store.setting.values.orgs
                    ? store.setting.values.orgs[org.id]
                    : false
                }
                onChange={val => {
                  store.setting.values = {
                    ...store.setting.values,
                    orgs: {
                      ...store.setting.values.orgs,
                      [org.id]: val,
                    },
                  }
                  console.log('settings.values is', store.setting.values)
                  store.setting.save()
                }}
              />
            </field>
          )}
        </UI.Form>

        <UI.Button onClick={() => CurrentUser.unlink('github')}>
          Unlink Github
        </UI.Button>
      </githubSettings>
    )
  }

  static style = {
    field: {
      padding: [5, 0],
    },
  }
}
