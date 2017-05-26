import node from '~/editor/node'
import EditList from 'slate-edit-list'
import { Button } from '~/ui'
import { BLOCKS } from '~/editor/constants'
import { replacer } from '~/editor/helpers'
import AutoReplace from 'slate-auto-replace'

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
    () => <Button icon="list-bullet" />,
    () => <Button icon="list-number" />,
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
