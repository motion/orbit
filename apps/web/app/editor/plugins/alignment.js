import { Button } from '~/ui'

export default class Alignment {
  name = 'alignment'
  category = 'alignment'

  barButtons = [
    () => <Button icon="align-left" />,
    () => <Button icon="align-right" />,
    () => <Button icon="align-center" />,
    () => <Button icon="align-justify" />,
    () => <Button icon="margin-left" />,
    () => <Button icon="margin-right" />,
  ]
}
