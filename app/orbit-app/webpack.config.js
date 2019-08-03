const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

// disabled for now, allows multi entry

module.exports = {
  main: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['typescript'],
        features: [
          'bracketMatching',
          'caretOperations',
          'clipboard',
          'codeAction',
          'codelens',
          'comment',
          'coreCommands',
          'cursorUndo',
          'find',
          'folding',
          'fontZoom',
          'format',
          'gotoError',
          'gotoLine',
          'hover',
          'inPlaceReplace',
          'inspectTokens',
          'linesOperations',
          'multicursor',
          'parameterHints',
          'quickOutline',
          'rename',
          'smartSelect',
          'suggest',
          'toggleHighContrast',
          'toggleTabFocusMode',
          'transpose',
          'wordHighlighter',
          'wordOperations',
          'wordPartOperations',
        ],
      }),
    ],
  },
}
