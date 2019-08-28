import SlateEditList from '@tommoor/slate-edit-list'

export const EditList = SlateEditList({
  types: ['ordered-list', 'bulleted-list', 'todo-list'],
  typeItem: 'list-item',
  typeDefault: 'paragraph',
})
