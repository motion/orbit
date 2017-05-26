export list from './list'
export link from './link'
export markdown from './markdown'
export quote from './quote'
export emphasize from './emphasize'
export selection from './selection'
export table from './table'
export text from './text'

import { BLOCKS } from '~/editor/constants'
import node from '~/editor/node'

const paragraph = node(props => (
  <p {...props.attributes} $$style={{ fontSize: 18 }}>{props.children}</p>
))

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

import docListPlugin from '../old/plugins/docList'
import docListNode from '../old/nodes/docList'
export class docList {
  plugins = [docListPlugin]
  nodes = {
    [BLOCKS.DOC_LIST]: docListNode,
  }
}

import imagePlugin from '../old/plugins/image'
import imageNode from '../old/nodes/image'
export class image {
  plugins = [imagePlugin]
  nodes = {
    [BLOCKS.IMAGE]: imageNode,
  }
}

import hashtagPlugin from '../old/plugins/hashtag'
export class hashtag {
  plugins = [hashtagPlugin]
}

import hashtagsPlugin from '../old/plugins/hashtags'
export class hashtags {
  plugins = [hashtagsPlugin]
}

import counterPlugin from '../old/plugins/counter'
import counterNode from '../old/nodes/counter'
export class counter {
  nodes = {
    [BLOCKS.COUNTER]: counterNode,
  }
  plugins = [counterPlugin]
}

import rowPlugin from '../old/plugins/row'
import rowNode from '../old/nodes/row'
import columnNode from '../old/nodes/column'
export class row {
  nodes = {
    [BLOCKS.ROW]: rowNode,
    [BLOCKS.COLUMN]: columnNode,
  }
  plugins = [rowPlugin]
}
