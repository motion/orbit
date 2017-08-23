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
            <UI.Field key={org.id} label={org.login} type="toggle" />
          )}
        </UI.Form>
      </githubSettings>
    )
  }
}
