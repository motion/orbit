const { join } = require('path')

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

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
