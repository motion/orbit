import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'

const integration = window.location.search.match(/service\=(.*)/)[1]

@view
export default class AuthApp {
  componentDidMount() {
    this.link()
  }

  link = () => CurrentUser.link(integration)

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
              onClick={this.link}
            >
              Authorize {integration}
            </UI.Button>
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
