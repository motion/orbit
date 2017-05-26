export counter from './counter'
export form from './form'
export image from './image'
export list from './list'
export link from './link'
export markdown from './markdown'
export quote from './quote'
export emphasize from './emphasize'
export row from './row'
export selection from './selection'
export table from './table'
export text from './text'
export todo from './todo'
export docList from './docList'

import { BLOCKS } from '~/editor/constants'
import node from '~/editor/node'

const hr = props => node(<hr {...props.attributes} />)

export class Separators {
  nodes = {
    [BLOCKS.HR]: hr,
  }
}
