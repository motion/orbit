const { join } = require('path')

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = [
  {
    entry: {
      monaco: join(__dirname, 'src', 'monaco'),
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['json', 'javascript'],
      }),
    ],
  },
]
