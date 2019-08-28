import { Block, Editor, SlateError } from 'slate'

function removeInlines(editor: Editor, error: SlateError) {
  if (error.code === 'child_object_invalid') {
    editor.unwrapInlineByKey(error.child.key, error.child.type)
  }
}

export const schema = {
  blocks: {
    heading1: {
      nodes: [{ match: { object: 'text' } }],
      // @ts-ignore
      marks: [''],
      normalize: removeInlines,
    },
    heading2: {
      nodes: [{ match: { object: 'text' } }],
      // @ts-ignore
      marks: [''],
      normalize: removeInlines,
    },
    heading3: {
      nodes: [{ match: { object: 'text' } }],
      // @ts-ignore
      marks: [''],
      normalize: removeInlines,
    },
    heading4: {
      nodes: [{ match: { object: 'text' } }],
      // @ts-ignore
      marks: [''],
      normalize: removeInlines,
    },
    heading5: {
      nodes: [{ match: { object: 'text' } }],
      // @ts-ignore
      marks: [''],
      normalize: removeInlines,
    },
    heading6: {
      nodes: [{ match: { object: 'text' } }],
      // @ts-ignore
      marks: [''],
      normalize: removeInlines,
    },
    code: {
      // @ts-ignore
      marks: [''],
    },
    'horizontal-rule': {
      isVoid: true,
    },
    image: {
      isVoid: true,
    },
    link: {
      nodes: [{ match: { object: 'text' } }],
    },
    'block-toolbar': {
      isVoid: true,
    },
    'list-item': {
      parent: [{ type: 'bulleted-list' }, { type: 'ordered-list' }, { type: 'todo-list' }],
      nodes: [
        {
          match: [
            { object: 'text' },
            { type: 'image' },
            { type: 'paragraph' },
            { type: 'bulleted-list' },
            { type: 'ordered-list' },
            { type: 'todo-list' },
          ],
        },
      ],
    },
  },
  document: {
    // ensure header always there
    normalize: (editor: Editor, error: SlateError) => {
      switch (error.code) {
        case 'child_max_invalid': {
          return editor.setNodeByKey(error.child.key, error.index === 0 ? 'heading1' : 'paragraph')
        }
        case 'child_min_invalid': {
          const missingTitle = error.index === 0
          const firstNode = editor.value.document.nodes.get(0)
          if (!firstNode) {
            editor.insertNodeByKey(error.node.key, 0, Block.create('heading1'))
          } else {
            editor.setNodeByKey(firstNode.key, { type: 'heading1' })
          }
          const secondNode = editor.value.document.nodes.get(1)
          if (!secondNode) {
            editor.insertNodeByKey(error.node.key, 1, Block.create('paragraph'))
          } else {
            editor.setNodeByKey(secondNode.key, { type: 'paragraph' })
          }
          if (missingTitle) setImmediate(() => editor.moveFocusToStartOfDocument())
          return editor
        }
        default:
      }
    },
    nodes: [
      { match: { type: 'heading1' }, min: 1, max: 1 },
      {
        match: [
          { type: 'paragraph' },
          { type: 'heading1' },
          { type: 'heading2' },
          { type: 'heading3' },
          { type: 'heading4' },
          { type: 'heading5' },
          { type: 'heading6' },
          { type: 'block-quote' },
          { type: 'code' },
          { type: 'horizontal-rule' },
          { type: 'image' },
          { type: 'bulleted-list' },
          { type: 'ordered-list' },
          { type: 'todo-list' },
          { type: 'block-toolbar' },
          { type: 'table' },
          { type: 'link' },
        ],
        min: 1,
      },
    ],
  },
}
