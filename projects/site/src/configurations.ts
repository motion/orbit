import { Icon } from '@o/kit'
import { configureUI } from '@o/ui'
import { setConfig } from 'react-hot-loader'

function configure() {
  const hasConfigured = window['hasConfigured']
  window['hasConfigured'] = true
  if (hasConfigured) return

  configureUI({
    useIcon: Icon,
  })

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
