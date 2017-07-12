import React from 'react'
import * as UI from '@mcro/ui'

export default class Alignment {
  name = 'alignment'
  category = 'text'

  contextButtons = [
    () =>
      <UI.Popover
        target={<UI.Button icon="align-justify" />}
        openOnHover
        background="transparent"
      >
        <UI.Segment>
          <UI.Button icon="align-left" />
          <UI.Button icon="align-right" />
          <UI.Button icon="align-center" />
          <UI.Button icon="align-justify" />
        </UI.Segment>
      </UI.Popover>,
  ]

  // barButtons = [
  //   () => <Button icon="margin-left" />,
  //   () => <Button icon="margin-right" />,
  // ]
}
