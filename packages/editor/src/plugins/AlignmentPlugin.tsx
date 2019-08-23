import * as UI from '@o/ui'
import React from 'react'

export class AlignmentPlugin {
  name = 'alignment'
  category = 'text'

  contextButtons = [
    () => (
      <UI.Popover target={<UI.Button icon="align-justify" />} openOnHover background="transparent">
        <UI.Row>
          <UI.Button icon="align-left" />
          <UI.Button icon="align-right" />
          <UI.Button icon="align-center" />
          <UI.Button icon="align-justify" />
        </UI.Row>
      </UI.Popover>
    ),
  ]
}
