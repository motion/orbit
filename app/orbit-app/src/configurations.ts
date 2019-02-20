import { configureGloss } from '@mcro/gloss'
import { configureUI } from '@mcro/ui'
import { configureUseStore } from '@mcro/use-store'
import { StoreContext } from './contexts'
import { Icon } from './views/Icon'

// run these only once, and avoid HMR above it

function setup() {
  window['hasConfigured'] = true

  configureGloss({
    pseudoAbbreviations: {
      hoverStyle: '&:hover',
      activeStyle: '&:active',
      focusStyle: '&:focus',
    },
  })

  configureUI({
    useIcon: Icon,
    StoreContext,
  })

  configureUseStore({
    debugStoreState: true,
  })
}

if (!window['hasConfigured']) {
  setup()
}

if (process.env.NODE_ENV === 'development') {
  if (typeof module['hot'] !== 'undefined') {
    module['hot'].accept(() => {
      console.log('Accepted configurations, ignoring on purpose')
    })
  }
}
