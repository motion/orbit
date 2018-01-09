import * as React from 'react'
import passportLink from '~/helpers/passportLink'
import r2 from '@mcro/r2'
import * as Constants from '~/constants'

const service = (window.location + '').split('service=')[1]

export default class AuthPage extends React.Component {
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
      <button
        css={{
          pointerEvents: 'auto',
          width: '100%',
          height: '100%',
          alignitems: 'center',
          justifyContent: 'center',
          background: 'purple',
          color: 'white',
          fontSize: 100,
        }}
        id="link"
        onClick={this.link}
        onMouseUp={this.link}
      >
        >>link {service}
      </button>
    )
  }
}
