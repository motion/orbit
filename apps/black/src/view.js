import decor from '@jot/decor'
import { object, string } from 'prop-types'
import extendsReact from '@jot/decor/lib/plugins/react/extendsReact'
import observer from '@jot/decor/lib/plugins/mobx/observer'
import autobound from '@jot/decor/lib/plugins/core/autobound'
import subscribableHelpers
  from '@jot/decor/lib/plugins/core/subscribableHelpers'
import subscribable from '@jot/decor/lib/plugins/react/subscribable'
import reactRenderArgs from '@jot/decor/lib/plugins/react/reactRenderArgs'
import addContext from '@jot/decor/lib/plugins/react/addContext'
import attach from '@jot/decor/lib/plugins/react/attach'
import storeProvidable from '@jot/decor/lib/plugins/react/storeProvidable'
import { storeOptions } from './store'
import gloss from './gloss'

const uiContext = [
  addContext,
  {
    uiTheme: object,
    uiActiveTheme: string,
    ui: object,
  },
]

// applied top to bottom
const getPlugins = ({ mobx, ui, autobind } = {}) => [
  extendsReact,
  subscribable,
  subscribableHelpers,
  ui && uiContext,
  reactRenderArgs,
  mobx && observer,
  // gloss after mobx
  options => ({ decorator: gloss }),
  // autobind last because it seals things
  autobind && autobound,
  [storeProvidable, storeOptions],
]

const viewDecorator = decor(getPlugins({ mobx: true, autobind: true }))

export default function view(viewOrStores: Object | Class | Function) {
  // @view({ ...stores }) shorthand
  if (typeof viewOrStores === 'object') {
    return viewDecorator({ stores: viewOrStores })
  }
  return viewDecorator(viewOrStores)
}

// pass on emitter
view.on = viewDecorator.on

// other decorators
view.plain = decor(getPlugins())
view.ui = decor(getPlugins({ ui: true, autobind: true }))
view.basics = decor([
  reactRenderArgs,
  extendsReact,
  opts => ({ decorator: gloss }),
])
view.provide = stores => viewDecorator({ stores, context: true })
view.attach = names => decor([[attach, { names }]])
