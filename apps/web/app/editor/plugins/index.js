export quote from './quote'
export emphasize from './emphasize'
export selection from './selection'

import { BLOCKS } from '~/editor/constants'
import node from '~/editor/node'

const paragraph = node(props => (
  <p {...props.attributes} $$style={{ fontSize: 18 }}>{props.children}</p>
))

const ol_list = node(props => (
  <ol $$ol {...props.attributes}>{props.children}</ol>
))

const ul_list = node(props => (
  <ul $$ul {...props.attributes}>{props.children}</ul>
))

const list_item = props => <li $$li {...props.attributes}>{props.children}</li>

const hr = props => node(<hr {...props.attributes} />)

const label = props => (
  <label style={{ fontSize: 13 }} {...props.attributes}>
    {props.children}
  </label>
)

export class Old {
  nodes = {
    [BLOCKS.PARAGRAPH]: paragraph,
    [BLOCKS.OL_LIST]: ol_list,
    [BLOCKS.UL_LIST]: ul_list,
    [BLOCKS.LIST_ITEM]: list_item,
    [BLOCKS.HR]: hr,
    [BLOCKS.LABEL]: label,
  }
}

import linkNode from '../old/nodes/link'
export class link {
  nodes = [linkNode]
}

import titleNode from '../old/nodes/title'
import titleStatic from '../old/plugins/titleStatic'
export class title {
  nodes = {
    [BLOCKS.TITLE]: titleNode,
  }
  plugins = [titleStatic]
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

import markdownPlugin from '../old/plugins/markdown'
export class markdown {
  plugins = [markdownPlugin]
}

import hashtagPlugin from '../old/plugins/hashtag'
export class hashtag {
  plugins = [hashtagPlugin]
}

import hashtagsPlugin from '../old/plugins/hashtags'
export class hashtags {
  plugins = [hashtagsPlugin]
}

import listPlugin from '../old/plugins/list'
export class list {
  plugins = [listPlugin]
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
