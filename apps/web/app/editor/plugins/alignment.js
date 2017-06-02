import { Popover, Button } from '~/ui'
import { createButton } from './helpers'

export default class Alignment {
  name = 'alignment'
  category = 'text'

  contextButtons = [
    () => (
      <Popover
        target={<Button icon="align-justify" />}
        openOnHover
        showForgiveness
        background
      >
        <row style={{ flexFlow: 'row' }}>
          <Button icon="align-left" />
          <Button icon="align-right" />
          <Button icon="align-center" />
          <Button icon="align-justify" />
        </row>
      </Popover>
    ),
  ]

  // barButtons = [
  //   () => <Button icon="margin-left" />,
  //   () => <Button icon="margin-right" />,
  // ]
}
