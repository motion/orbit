const path = require('path')
const views = require('./_/index')
const glossViews = require('gloss')
const configureUI = require('./_/helpers/configureUI').configureUI

// set up toColor etc
configureUI({})

module.exports = {
  views: { ...glossViews, ...views },
  defaultTheme: views.themes.light,
  mediaQueryKeys: ['xs', 'sm', 'abovesm', 'md', 'abovemd', 'lg', 'belowlg', 'abovelg'],
  internalViewsPaths: [
    path.join(path.dirname(require.resolve('@o/ui')), '..'),
    path.join(path.dirname(require.resolve('gloss')), '..'),
  ],
}
