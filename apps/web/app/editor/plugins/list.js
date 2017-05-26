import node from '~/editor/node'
import EditList from 'slate-edit-list'
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
  nodes = {
    [BLOCKS.OL_LIST]: ol_list,
    [BLOCKS.UL_LIST]: ul_list,
    [BLOCKS.LIST_ITEM]: list_item,
  }

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
