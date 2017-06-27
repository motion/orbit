// @flow
import decorator from '@jot/decor'
import { object, string } from 'prop-types'
import extendsReact, { ExtendsReact } from '@jot/decor/lib/plugins/react/extendsReact'
import observer from '@jot/decor/lib/plugins/mobx/observer'
import automagical from '@jot/decor/lib/plugins/mobx/automagical'
import autobound from '@jot/decor/lib/plugins/core/autobound'
import subscribableHelpers, { SubscribableHelpers } from '@jot/decor/lib/plugins/core/subscribableHelpers'
import subscribable, { Subscribable } from '@jot/decor/lib/plugins/react/subscribable'
import reactRenderArgs, { ReactRenderArgs } from '@jot/decor/lib/plugins/react/reactRenderArgs'
import addContext from '@jot/decor/lib/plugins/react/addContext'
import attach from '@jot/decor/lib/plugins/react/attach'
import storeProvidable from '@jot/decor/lib/plugins/react/storeProvidable'
import { storeOptions } from './store'
import { decorator as glossDecorator } from './gloss'
import type { Glossy } from './gloss'

export type ViewClass = ExtendsReact &
  Subscribable &
  SubscribableHelpers &
  ReactRenderArgs &
  Glossy

export type ViewDec = Function & {
  on(): ViewClass,
  ui(): ViewClass,
  basics(): ViewClass,
  provide(stores: Object): ViewClass,
  attach(...stores: Array<string>): ViewClass,
}

const uiContext = [
  addContext,
  {
    uiTheme: object,
    uiActiveTheme: string,
    ui: object,
  },
]

// applied top to bottom
const decorations = ({ mobx, ui, autobind, magic } = {}) => [
  extendsReact,
  subscribable,
  subscribableHelpers,
  ui && uiContext,
  reactRenderArgs,
  mobx && observer,
  // gloss after mobx
  options => ({ decorator: glossDecorator }),
  magic && automagical,
  // autobind last because it seals things
  autobind && autobound,
  [storeProvidable, storeOptions],
]

const base: () => ViewClass | (() => () => ViewClass) = decorator(
  decorations({ mobx: true, autobind: true, magic: false })
)

// @view
const view: ViewDec = (item: Object | Class<any> | Function): ViewClass => {
  // @view({ ...stores }) shorthand
  if (typeof item === 'object') {
    return base({ stores: item })
  }
  return base(item)
}

// pass on emitter
view.on = base.on

// other decorators
view.ui = decorator(decorations({ ui: true, autobind: true }))
view.basics = decorator([
  extendsReact,
  reactRenderArgs,
  observer,
  opts => ({ decorator: glossDecorator }),
])
view.provide = stores => base({ stores, context: true })
view.attach = names => decorator([[attach, { names }]])

export default view
