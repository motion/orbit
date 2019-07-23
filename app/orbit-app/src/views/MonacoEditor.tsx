import { useOnMount, useTheme, View, ViewProps } from '@o/ui'
import * as monaco from 'monaco-editor'
import React, { useEffect, useRef } from 'react'

export type MonacoEditorProps = monaco.editor.IEditorConstructionOptions &
  Pick<ViewProps, 'width' | 'height' | 'padding'> & {
    onChange?: (value: string, event: monaco.editor.IModelContentChangedEvent) => void
    noGutter?: boolean
  }

// any type because its using hidden options
const noGutterProps: any = {
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
}

export function MonacoEditor({ width, height, noGutter, padding, ...props }: MonacoEditorProps) {
  const node = useRef(null)
  const ed = useRef<monaco.editor.IStandaloneCodeEditor>(null)
  const theme = useTheme()
  const monacoTheme = props.theme || (theme.background.isDark() ? 'vs-dark' : 'vs-light')
  const background = monacoTheme === 'vs-dark' ? '#1e1e1e' : '#fff'
  const preventUpdate = useRef(false)

  useOnMount(() => {
    const editor = monaco.editor.create(node.current!, {
      ...props,
      theme: monacoTheme,
      ...(noGutter && noGutterProps),
    })

    // @ts-ignore
    ed.current = editor
  })

  useEffect(() => {
    preventUpdate.current = true
    ed.current!.setValue(props.value!)
    preventUpdate.current = false
  }, [props.value])

  useEffect(() => {
    const disposer = ed.current!.onDidChangeModelContent(event => {
      const value = ed.current!.getValue()
      if (!preventUpdate.current) {
        if (props.onChange) {
          props.onChange(value, event)
        }
      }
    })
    return () => {
      disposer.dispose()
    }
  }, [props.onChange])

  useEffect(() => {
    monaco.editor.setTheme(monacoTheme)
  }, [monacoTheme])

  useEffect(() => {
    ed.current!.layout()
  }, [width, height])

  return (
    <View
      background={background}
      ref={node}
      position="relative"
      overflow="hidden"
      width={width}
      height={height}
      padding={padding}
    />
  )
}

const defaults: MonacoEditorProps = {
  width: '100%',
  height: '100%',
  selectOnLineNumbers: true,
  roundedSelection: true,
  cursorStyle: 'line',
  automaticLayout: true,
  scrollBeyondLastLine: false,
  showUnused: true,
  lineNumbers: 'off',
  highlightActiveIndentGuide: false,
  renderLineHighlight: 'none',
  minimap: {
    enabled: false,
  },
  scrollbar: {
    horizontalScrollbarSize: 0,
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
