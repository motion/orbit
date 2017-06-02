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

editList.utils.isInListOfType = (state, type) => {
  const list = editList.utils.getCurrentList(state)
  return list && list.type === type
}

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

  utils = editList.utils
  transforms = editList.transforms

  nodes = {
    [OL_LIST]: ol_list,
    [UL_LIST]: ul_list,
    [LIST_ITEM]: list_item,
  }

  barButtons = [
    createButton({
      icon: 'list-bullet',
      type: UL_LIST,
      tooltip: 'Bulleted List',
      wrap: t => editList.transforms.wrapInList(t, UL_LIST),
      unwrap: editList.transforms.unwrapList,
      isActive: state => editList.utils.isInListOfType(state, UL_LIST),
    }),
    createButton({
      icon: 'list-number',
      type: OL_LIST,
      tooltip: 'Numbered List',
      wrap: t => editList.transforms.wrapInList(t, OL_LIST),
      unwrap: editList.transforms.unwrapList,
      isActive: state => editList.utils.isInListOfType(state, OL_LIST),
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
