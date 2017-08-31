// @flow
import decor from '@mcro/decor'
import { object, string } from 'prop-types'
import extendsReact from '@mcro/decor/lib/plugins/react/extendsReact'
import type { ExtendsReact } from '@mcro/decor/lib/plugins/react/extendsReact'
import observer from '@mcro/decor/lib/plugins/mobx/observer'
import automagical from '@mcro/automagical'
import helpers from '@mcro/decor/lib/plugins/mobx/helpers'
import type { Helpers } from '@mcro/decor/lib/plugins/mobx/helpers'
import subscribable from '@mcro/decor/lib/plugins/react/subscribable'
import type { Subscribable } from '@mcro/decor/lib/plugins/react/subscribable'
import emitsMount from '@mcro/decor/lib/plugins/react/emitsMount'
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

export type DecoratorType = (
  opts: ?Object
) => ViewClass | ((opts: ?Object) => () => ViewClass)

const uiContext = [
  addContext,
  {
    uiActiveThemeName: string,
    uiActiveTheme: object,
    uiThemes: object,
    ui: object,
  },
]

// applied top to bottom
const decorations = ({ mobx, ui, magic } = {}) => [
  !ui && emitsMount,
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
  decorations({ mobx: true, magic: true, ui: true })
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
view.off = base.off
view.emit = base.emit

// other decorators
view.ui = decor(decorations({ ui: true }))
view.basics = decor([
  extendsReact,
  reactRenderArgs,
  observer,
  () => ({ decorator: glossDecorator }),
])

const providable = decor([[storeProvidable, storeOptions]])
view.provide = stores => providable({ stores, context: true })
view.provide.on = providable.on

view.attach = (...names) => decor([[attach, { names }]])

export default view
