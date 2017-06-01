import { Button } from '~/ui'
import { createButton } from './helpers'

export default class Alignment {
  name = 'alignment'
  category = 'alignment'

  contextButtons = [
    () => <Button icon="align-left" />,
    () => <Button icon="align-right" />,
    () => <Button icon="align-center" />,
    () => <Button icon="align-justify" />,
  ]

  // barButtons = [
  //   () => <Button icon="margin-left" />,
  //   () => <Button icon="margin-right" />,
  // ]
}
