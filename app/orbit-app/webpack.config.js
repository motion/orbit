const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

// disabled for now, allows multi entry

module.exports = {
  main: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['typescript'],
      }),
    ],
  },
}
