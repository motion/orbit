const Path = require('path')
const views = require('./_/index')

module.exports = {
  views: views,
  defaultTheme: views.themes.light,
  mediaQueryKeys: ['xs', 'sm', 'abovesm', 'md', 'abovemd', 'lg', 'belowlg', 'abovelg'],
  internalViewsPath: Path.join(require.resolve('@o/ui'), '..', '..'),
}
