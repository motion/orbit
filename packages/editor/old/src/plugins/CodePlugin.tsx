import * as React from 'react'

import { BLOCKS } from '../constants'
import { createButton } from './helpers'

export class CodePlugin {
  name = 'code'
  category = 'blocks'

  nodes = {
    [BLOCKS.CODE]: props => <code {...props.attributes}>{props.children}</code>,
  }

  barButtons = [createButton({ icon: 'code', type: BLOCKS.CODE, tooltip: 'Code' })]
}
