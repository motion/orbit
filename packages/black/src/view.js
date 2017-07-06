// @flow
import decor from '@mcro/decor'
import { object, string } from 'prop-types'
import extendsReact from '@mcro/decor/lib/plugins/react/extendsReact'
import type { ExtendsReact } from '@mcro/decor/lib/plugins/react/extendsReact'
import observer from '@mcro/decor/lib/plugins/mobx/observer'
import automagical from '@mcro/decor/lib/plugins/mobx/automagical'
import helpers from '@mcro/decor/lib/plugins/core/helpers'
import type { Helpers } from '@mcro/decor/lib/plugins/core/helpers'
import subscribable from '@mcro/decor/lib/plugins/react/subscribable'
import type { Subscribable } from '@mcro/decor/lib/plugins/react/subscribable'
import reactRenderArgs from '@mcro/decor/lib/plugins/react/reactRenderArgs'
import type { ReactRenderArgs } from '@mcro/decor/lib/plugins/react/reactRenderArgs'
import addContext from '@mcro/decor/lib/plugins/react/addContext'
import attach from '@mcro/decor/lib/plugins/react/attach'
import storeProvidable from '@mcro/decor/lib/plugins/react/storeProvidable'
import { storeOptions } from './store'
import { decorator as glossDecorator } from './gloss'
import type { Glossy } from './gloss'

export type ViewClass = ExtendsReact &
  Subscribable &
  Helpers &
  ReactRenderArgs &
  Glossy

export type ViewDec = Function & {
  on(): ViewClass,
  ui(): ViewClass,
  basics(): ViewClass,
  provide(stores: Object): ViewClass,
  attach(...stores: Array<string>): ViewClass,
}

export type DecoratorType = () => ViewClass | (() => () => ViewClass)

const uiContext = [
  addContext,
  {
    uiTheme: object,
    uiActiveTheme: string,
    ui: object,
  },
]

// applied top to bottom
const decorations = ({ mobx, ui, magic } = {}) => [
  extendsReact,
  subscribable,
  helpers,
  ui && uiContext,
  reactRenderArgs,
  mobx && observer,
  // gloss after mobx
  () => ({ decorator: glossDecorator }),
  magic && automagical,
  [storeProvidable, storeOptions],
]

const base: DecoratorType = decor(
  decorations({ mobx: true, magic: false, ui: true })
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
view.ui = decor(decorations({ ui: true }))
view.basics = decor([
  extendsReact,
  reactRenderArgs,
  observer,
  () => ({ decorator: glossDecorator }),
])
view.provide = stores => base({ stores, context: true })
view.attach = (...names) => decor([[attach, { names }]])

export default view
