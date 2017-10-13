import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import * as Constants from '~/constants'

const ALL_INTEGRATIONS = ['slack', 'github', 'google']
const integration = Constants.AUTH_SERVICE

@view
export default class AuthApp {
  componentDidMount() {
    if (integration) {
      this.link(integration)()
    }
  }

  link = name => () => CurrentUser.link(name)

  render() {
    return (
      <UI.Theme name="light">
        <settings>
          <header>
            <UI.Title size={4}>Setup Orbit</UI.Title>
          </header>

          <content>
            <UI.Button
              key={integration}
              size={2}
              icon={`social${integration}`}
              onClick={this.link(integration)}
            >
              Authorize {integration}
            </UI.Button>

            <br />
            <br />

            <UI.Row stretch>
              {ALL_INTEGRATIONS.filter(x => x !== integration).map(name => (
                <UI.Button
                  key={name}
                  size={1.2}
                  icon={`social${name}`}
                  onClick={this.link(name)}
                >
                  Authorize {name}
                </UI.Button>
              ))}
            </UI.Row>
          </content>
        </settings>
      </UI.Theme>
    )
  }

  static style = {
    settings: {
      padding: 20,
    },
    header: {
      padding: 20,
    },
  }
}
