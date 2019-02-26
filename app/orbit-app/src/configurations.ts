import { configureGloss } from '@mcro/gloss'
import { configureKit, Icon } from '@mcro/kit'
import { configureUI } from '@mcro/ui'
import { configureUseStore } from '@mcro/use-store'
import { orbitApps } from './apps/orbitApps'
import { StoreContext } from './contexts'

// run these only once, and avoid HMR above it

function setup() {
  window['hasConfigured'] = true

  configureKit({
    StoreContext,
    getApps: () => orbitApps,
  })

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
