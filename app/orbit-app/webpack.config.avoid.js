const { join } = require('path')

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

// disabled for now, allows multi entry

module.exports = {
  monaco: {
    entry: {
      main: [join(__dirname, 'src', 'monaco')],
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['json', 'javascript'],
      }),
    ],
  },
}
