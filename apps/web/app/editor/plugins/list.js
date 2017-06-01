import { view } from '~/helpers'
import node from '~/editor/node'
import EditList from 'slate-edit-list'
import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'
import { replacer } from '~/editor/helpers'
import AutoReplace from 'slate-auto-replace'
import { createButton } from './helpers'

const editList = EditList()

const ol_list = node(
  view(props => <ol $$ol {...props.attributes}>{props.children}</ol>)
)

const ul_list = node(
  view(props => <ul $$ul {...props.attributes}>{props.children}</ul>)
)

const list_item = view(props => (
  <li $$li {...props.attributes}>{props.children}</li>
))

export default class List {
  name = 'list'
  category = 'blocks'

  nodes = {
    [BLOCKS.OL_LIST]: ol_list,
    [BLOCKS.UL_LIST]: ul_list,
    [BLOCKS.LIST_ITEM]: list_item,
  }

  barButtons = [
    createButton('list-bullet', BLOCKS.UL_LIST, {
      wrap: t => editList.transforms.wrapInList(t, BLOCKS.UL_LIST),
      unwrap: editList.transforms.unwrapList,
    }),
    createButton('list-number', BLOCKS.OL_LIST, {
      wrap: t => editList.transforms.wrapInList(t, BLOCKS.OL_LIST),
      unwrap: editList.transforms.unwrapList,
    }),
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
