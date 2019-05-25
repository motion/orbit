import { View, ViewProps } from '@o/ui'
import React from 'react'
import ReactMonacoEditor from 'react-monaco-editor'

const options = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line',
  automaticLayout: true,
}

export function MonacoEditor(props: ViewProps) {
  return (
    <View
      className="reset"
      position="relative"
      overflow="hidden"
      width="100%"
      height="100%"
      {...props}
    >
      <ReactMonacoEditor
        width="100%"
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={`function() {}`}
        options={options}
        //  onChange={::this.onChange}
        //  editorDidMount={::this.editorDidMount}
      />
    </View>
  )
}
