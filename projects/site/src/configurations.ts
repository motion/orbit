import { Icon } from '@o/kit'
import { configureUI } from '@o/ui'
import { setConfig } from 'react-hot-loader'

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

if (module['hot']) {
  module['hot'].accept()
}
