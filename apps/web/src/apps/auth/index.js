import * as React from 'react'
import passportLink from '~/helpers/passportLink'
import r2 from '@mcro/r2'
import * as Constants from '~/constants'

const service = (window.location + '').split('service=')[1]

async function link() {
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

export default () => (
  <div
    css={{
      width: '100%',
      height: '100%',
      alignitems: 'center',
      justifyContent: 'center',
      background: 'green',
      color: 'white',
      fontSize: 100,
    }}
    id="link"
    onClick={link}
  >
    link {service}
  </div>
)
