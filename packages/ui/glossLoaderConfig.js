const path = require('path')
const views = require('./_/index')
const glossViews = require('gloss')
const { configureUI, Config } = require('./_/helpers/configureUI')

module.exports = (glossConfig, uiConfig) => {
  // set up toColor, mediaQueries
  try {
    configureUI(uiConfig || {})
  } catch {
    // already set up
  }
  return {
    views: { ...glossViews, ...views },
    defaultTheme: views.themes.light,
    mediaQueryKeys: Object.keys(Config.mediaQueries),
    internalViewsPaths: [
      path.join(path.dirname(require.resolve('@o/ui')), '..'),
      path.join(path.dirname(require.resolve('gloss')), '..'),
    ],
    ...glossConfig,
  }
}
