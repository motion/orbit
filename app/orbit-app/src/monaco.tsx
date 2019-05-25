import { useOnMount, View, ViewProps } from '@o/ui'
import * as monaco from 'monaco-editor'
import React, { useEffect, useRef } from 'react'

export type MonacoEditorProps = monaco.editor.IEditorConstructionOptions &
  Pick<ViewProps, 'width' | 'height'>

export function MonacoEditor({ width, height, ...props }: MonacoEditorProps) {
  const node = useRef(null)
  const mnco = useRef(null)

  useOnMount(() => {
    mnco.current = monaco.editor.create(node.current, props)
  })

  useEffect(() => {
    monaco.editor.setTheme(props.theme)
  }, [props.theme])

  useEffect(() => {
    mnco.current.layout()
  }, [width, height])

  return <View ref={node} position="relative" overflow="hidden" width={width} height={height} />
}

const defaults: MonacoEditorProps = {
  width: '100%',
  height: '100%',
  selectOnLineNumbers: true,
  roundedSelection: true,
  cursorStyle: 'line',
  theme: 'vs-dark',
  automaticLayout: true,
  scrollBeyondLastLine: false,
  highlightActiveIndentGuide: false,
  renderLineHighlight: 'gutter',
  minimap: {
    enabled: false,
  },
  scrollbar: {
    horizontalScrollbarSize: 5,
    horizontalSliderSize: 0,
    useShadows: false,
  },
  value: `export class Something {
  x = 0

  run() {
    console.log('hello world')
  }
}`,
  language: 'typescript',
}

MonacoEditor.defaultProps = defaults
