import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'

export default class Code {
  name = 'code'
  category = 'blocks'

  nodes = {
    [BLOCKS.CODE]: props => <code {...props.attributes}>{props.children}</code>,
  }

  barButtons = [() => <Button icon="code" tooltip="code" />]
}
