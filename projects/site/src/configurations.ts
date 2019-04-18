import { ThemeMaker } from '@o/gloss'
import { toColor } from '@o/ui'
import { setConfig } from 'react-hot-loader'
import ResizeObserver from 'resize-observer-polyfill'
import { themes } from './themes'

if (process.env.NODE_ENV === 'development') {
  window['ResizeObserver'] = ResizeObserver
  window['Themes'] = themes
  window['toColor'] = toColor
  window['ThemeMaker'] = new ThemeMaker()
}

function configure() {
  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true
  if (hasConfigured) return

  // just for now since its spitting out so many
  setConfig({
    logLevel: 'no-errors-please',
    pureSFC: true,
    pureRender: true,
    // disableHotRenderer: true,
  })
}

configure()

if (module['hot']) {
  module['hot'].accept()
}
