import * as React from 'react'
import { view } from '@mcro/black'
import passportLink from '~/helpers/passportLink'
import r2 from '@mcro/r2'
import * as Constants from '~/constants'
import * as UI from '@mcro/ui'
import { capitalize } from 'lodash'

const service = (window.location + '').split('service=')[1]

@view
export default class AuthPage {
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
        <UI.Button
          size={1.5}
          theme="#4C36C4"
          $button
          id="link"
          onClick={this.link}
          onMouseUp={this.link}
        >
          Link {capitalize(service)}
        </UI.Button>
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
  }
}
