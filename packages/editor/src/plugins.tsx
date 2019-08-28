import EditTable from '@domoinc/slate-edit-table'
import EditBlockquote from '@wikifactory/slate-edit-blockquote'
import EditCode from '@wikifactory/slate-edit-code'
import TrailingBlock from '@wikifactory/slate-trailing-block'
import Prism from 'golery-slate-prism'
import * as React from 'react'
import { Editor, Node } from 'slate'
import CollapseOnEscape from 'slate-collapse-on-escape'
import InsertImages from 'slate-drop-or-paste-images'
import PasteLinkify from 'slate-paste-linkify'

import { Marks } from './Marks'
import { Nodes } from './Nodes'
import { Chrome } from './plugins/Chrome'
import { CollapsableHeadings } from './plugins/CollapsableHeadings'
import { EditList } from './plugins/EditList'
import { Ellipsis } from './plugins/Ellipsis'
import { Embeds } from './plugins/Embeds'
import { FocusPlugin } from './plugins/FocusPlugin'
import { KeyboardBehavior } from './plugins/KeyboardBehavior'
import { KeyboardShortcuts } from './plugins/KeyboardShortcuts'
import { MarkdownPaste } from './plugins/MarkdownPaste'
import { MarkdownShortcuts } from './plugins/MarkdownShortcuts'
import { PlaceholderPlugin } from './plugins/Placeholder'
import { TablePlugin } from './plugins/Table'

require('prismjs/components/prism-bash')
require('prismjs/components/prism-csharp')
require('prismjs/components/prism-java')
require('prismjs/components/prism-php')
require('prismjs/components/prism-powershell')
require('prismjs/components/prism-python')
require('prismjs/components/prism-ruby')
require('prismjs/components/prism-typescript')

// additional language support based on the most popular programming languages
export const createPlugins = ({
  placeholder,
  getLinkComponent,
}: {
  placeholder: string
  getLinkComponent?: (node: Node) => React.ComponentType<any> | null
}) => {
  return [
    Nodes,
    Marks,
    PasteLinkify({
      type: 'link',
      collapseTo: 'end',
    }),
    PlaceholderPlugin({
      placeholder,
      when: (editor: Editor, node: Node) => {
        if (editor.readOnly) return false
        if (node.object !== 'block') return false
        if (node.type !== 'paragraph') return false
        if (node.text !== '') return false
        if (editor.value.document.getBlocks().size > 1) return false
        return true
      },
    }),
    FocusPlugin(),
    InsertImages({
      extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
      insertImage: (editor, file) => editor.insertImageFile(file),
    }),
    EditCode({
      containerType: 'code',
      lineType: 'code-line',
      exitBlocktype: 'paragraph',
      allowMarks: false,
      selectAll: true,
    }),
    EditBlockquote({
      type: 'block-quote',
      typeDefault: 'paragraph',
    }),
    EditTable({
      typeTable: 'table',
      typeRow: 'table-row',
      typeCell: 'table-cell',
      typeContent: 'paragraph',
    }),
    TablePlugin(),
    Prism({
      onlyIn: node => node.type === 'code',
      getSyntax: node => node.data.get('language') || 'javascript',
    }),
    Embeds({ getComponent: getLinkComponent }),
    CollapseOnEscape({ toEdge: 'end' }),
    CollapsableHeadings(),
    EditList,
    KeyboardBehavior(),
    KeyboardShortcuts(),
    MarkdownShortcuts(),
    MarkdownPaste(),
    Ellipsis(),
    TrailingBlock({ type: 'paragraph' }),
    Chrome(),
  ]
}
