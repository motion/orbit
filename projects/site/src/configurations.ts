import { setConfig } from 'react-hot-loader'
import ResizeObserver from 'resize-observer-polyfill'

console.log('io', require('intersection-observer'))

function configure() {
  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true
  if (hasConfigured) return

  window['ResizeObserver'] = ResizeObserver

  // console.log('using icon', require('@o/kit').Icon)
  // require('@o/ui').configureUI({
  //   useIcon: require('@o/kit').Icon,
  // })

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
