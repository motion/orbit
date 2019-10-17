const path = require('path')
const views = require('./_/index')
const glossViews = require('gloss')

module.exports = {
  views: { ...glossViews, ...views },
  defaultTheme: views.themes.light,
  mediaQueryKeys: ['xs', 'sm', 'abovesm', 'md', 'abovemd', 'lg', 'belowlg', 'abovelg'],
  internalViewsPaths: [
    path.join(path.dirname(require.resolve('@o/ui')), '..'),
    path.join(path.dirname(require.resolve('gloss')), '..'),
  ],
}
