import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Setting } from '~/app'

@view({
  store: class GithubSettingStore {
    orgs = null
    setting = Setting.findOne({
      type: 'github',
      userId: CurrentUser.id,
    })

    get token() {
      return this.props.integration.auth.accessToken
    }

    async start() {
      this.orgs = await fetch(
        `https://api.github.com/user/orgs?access_token=${this.token}`
      ).then(res => res.json())
    }
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
