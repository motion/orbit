import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export class ConfluenceSettingLogin extends React.Component {
  render() {
    return (
      <auth>
        <UI.Row label="Username">
          <UI.Input />
        </UI.Row>
        <UI.Row label="Password">
          <UI.Input />
        </UI.Row>
        <UI.Row>
          <UI.Button>Submit</UI.Button>
        </UI.Row>
      </auth>
    )
  }

  static style = {
    auth: {
      margin: 'auto',
    },
  }
}
