import decor from '@jot/decor'
import extendsReact from '@jot/decor/plugins/view/extendsReact'
import observer from '@jot/decor/plugins/mobx/observer'
import autobound from '@jot/decor/plugins/core/autobound'
import subscribableHelpers from '@jot/decor/plugins/core/subscribableHelpers'
import subscribable from '@jot/decor/plugins/react/subscribable'
import reactRenderArgs from '@jot/decor/plugins/react/reactRenderArgs'
import addContext from '@jot/decor/plugins/react/addContext'
import attach from '@jot/decor/plugins/react/attach'
import { storeProvider } from './store'

const base = [
  extendsReact,
  autobound,
  subscribable,
  subscribableHelpers,
  reactRenderArgs,
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
