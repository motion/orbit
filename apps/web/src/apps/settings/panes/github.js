import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view({
  store: class GithubSettingStore {
    orgs = null

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
        <UI.Form if={store.orgs}>
          {store.orgs.map(org =>
            <field key={org.id}>
              <UI.Field size={1.2} label={org.login} type="toggle" />
            </field>
          )}
        </UI.Form>
      </githubSettings>
    )
  }

  static style = {
    field: {
      padding: [5, 0],
    },
  }
}
