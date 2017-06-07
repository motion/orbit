import decor from '@jot/decor'
import { object, string } from 'prop-types'
import extendsReact from '@jot/decor/lib/plugins/react/extendsReact'
import observer from '@jot/decor/lib/plugins/mobx/observer'
import autobound from '@jot/decor/lib/plugins/core/autobound'
import subscribableHelpers from '@jot/decor/lib/plugins/core/subscribableHelpers'
import subscribable from '@jot/decor/lib/plugins/react/subscribable'
import reactRenderArgs from '@jot/decor/lib/plugins/react/reactRenderArgs'
import addContext from '@jot/decor/lib/plugins/react/addContext'
import attach from '@jot/decor/lib/plugins/react/attach'
import { storeProvider } from './store'
import gloss from './gloss'

const base = [
  extendsReact,
  autobound,
  subscribable,
  subscribableHelpers,
  reactRenderArgs,
  options => ({ decorator: gloss }),
]

const mobx = [observer]

const ui = [
  [
    addContext,
    {
      uiTheme: object,
      uiActiveTheme: string,
      ui: object,
    },
  ],
]

const viewDecorator = decor([...base, ...mobx])

const withStores = (Stores, options) => View =>
  storeProvider(Stores, options)(viewDecorator(View))

// @view({ ...stores }) shorthand
export default function view(viewOrStores: Object | Class | Function) {
  if (typeof viewOrStores === 'object') {
    return withStores(viewOrStores)
  }
  return viewDecorator(viewOrStores)
}

view.plain = decor(base)
view.ui = decor([...base, ...ui])
view.provide = withStores
view.attach = decor([attach])

window.x = view
