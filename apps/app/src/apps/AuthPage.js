import * as React from 'react'
import { view } from '@mcro/black'
import passportLink from '~/helpers/passportLink'
import r2 from '@mcro/r2'
import * as Constants from '~/constants'
import * as UI from '@mcro/ui'
import { capitalize } from 'lodash'

const service = (window.location + '').split('service=')[1]

@view
export class AuthPage {
  link = async () => {
    console.log('linking service...', service)
    const info = await passportLink(`${Constants.API_URL}/auth/${service}`)
    await r2.post(`${Constants.API_URL}/setCreds`, {
      json: {
        [service]: {
          ...info,
          updatedAt: Date.now(),
        },
      },
    })
  }

  render() {
    return (
      <wrap>
        <UI.Theme theme="#4C36C4">
          <UI.Button
            size={1.5}
            $button
            id="link"
            onClick={this.link}
            onMouseUp={this.link}
          >
            Link {capitalize(service)}
          </UI.Button>
        </UI.Theme>

        <message>
          <UI.Text fontWeight={500} size={1.2}>
            Privacy notice
          </UI.Text>
          <br />
          <UI.Text size={1.1}>
            Only <strong>this computer</strong> will have access to your keys
            and any data associated with this integration.
            <br />
            <br />
            Remember, Orbit (the company) never touches in any form any data.
            Only your local computer will use this to sync data down directly
            from {service}.
          </UI.Text>
        </message>
      </wrap>
    )
  }

  static style = {
    wrap: {
      background: '#fff',
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'auto',
      padding: [0, 30],
    },
    message: {
      width: 500,
      padding: 20,
      margin: 40,
      borderRadius: 5,
      background: '#f2f2f2',
    },
  }
}
