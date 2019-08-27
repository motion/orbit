import * as React from 'react'
import { Editor } from 'slate'

import { EditorProps } from '..'
import { BlockInsert } from '../components/BlockInsert'
import { Contents } from '../components/Contents'
import { Toolbar } from '../components/Toolbar'

export function Chrome() {
  function renderEditor(props: EditorProps, editor: Editor, next: () => React.ReactNode) {
    const children = next()
    return (
      <>
        {!props.readOnly && <Toolbar value={editor.value} editor={editor} />}
        {!props.readOnly && <BlockInsert editor={editor} />}
        {props.toc && <Contents editor={editor} />}
        {children}
      </>
    )
  }

  return { renderEditor }
}
