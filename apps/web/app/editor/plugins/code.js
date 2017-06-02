import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'
import { createButton } from './helpers'

export default class Code {
  name = 'code'
  category = 'blocks'

  nodes = {
    [BLOCKS.CODE]: props => <code {...props.attributes}>{props.children}</code>,
  }

  barButtons = [
    createButton({ icon: 'code', type: BLOCKS.CODE, tooltip: 'Code' }),
  ]
}
