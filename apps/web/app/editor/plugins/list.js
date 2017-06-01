import { view } from '~/helpers'
import node from '~/editor/node'
import EditList from 'slate-edit-list'
import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'
import { replacer } from '~/editor/helpers'
import AutoReplace from 'slate-auto-replace'
import { createButton } from './helpers'

const { UL_LIST, OL_LIST, LIST_ITEM } = BLOCKS
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
    [OL_LIST]: ol_list,
    [UL_LIST]: ul_list,
    [LIST_ITEM]: list_item,
  }

  barButtons = [
    createButton('list-bullet', UL_LIST, {
      wrap: t => editList.transforms.wrapInList(t, UL_LIST),
      unwrap: editList.transforms.unwrapList,
    }),
    createButton('list-number', OL_LIST, {
      wrap: t => editList.transforms.wrapInList(t, OL_LIST),
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
