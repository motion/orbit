import node from '~/editor/node'
import EditList from 'slate-edit-list'
import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'
import { replacer } from '~/editor/helpers'
import AutoReplace from 'slate-auto-replace'
import { createButton } from './helpers'

const editList = EditList()

const ol_list = node(props => (
  <ol $$ol {...props.attributes}>{props.children}</ol>
))

const ul_list = node(props => (
  <ul $$ul {...props.attributes}>{props.children}</ul>
))

const list_item = props => <li $$li {...props.attributes}>{props.children}</li>

export default class List {
  name = 'list'
  category = 'blocks'

  nodes = {
    [BLOCKS.OL_LIST]: ol_list,
    [BLOCKS.UL_LIST]: ul_list,
    [BLOCKS.LIST_ITEM]: list_item,
  }

  barButtons = [
    createButton('list-bullet', BLOCKS.UL_LIST),
    createButton('list-number', BLOCKS.OL_LIST),
  ]

  plugins = [
    // list functions
    editList,
    // markdown
    AutoReplace({
      trigger: 'space',
      before: /^(-)$/,
      transform: transform => transform.call(editList.transforms.wrapInList),
    }),
  ]
}
