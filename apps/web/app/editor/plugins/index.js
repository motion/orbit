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

const label = props => (
  <label style={{ fontSize: 13 }} {...props.attributes}>
    {props.children}
  </label>
)

export class Old {
  nodes = {
    [BLOCKS.HR]: hr,
    [BLOCKS.LABEL]: label,
  }
}

import formPlugin from '../old/plugins/form'
export class form {
  plugins = [formPlugin]
}

import counterPlugin from '../old/plugins/counter'
import counterNode from '../old/nodes/counter'
export class counter {
  nodes = {
    [BLOCKS.COUNTER]: counterNode,
  }
  plugins = [counterPlugin]
}
