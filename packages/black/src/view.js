// @flow
import decor from '@mcro/decor'
import { object, string } from 'prop-types'
import extendsReact from '@mcro/decor/lib/plugins/react/extendsReact'
// import type { ExtendsReact } from '@mcro/decor/src/plugins/react/extendsReact'
import observer from '@mcro/decor/lib/plugins/mobx/observer'
import automagical from '@mcro/automagical'
import helpers from '@mcro/decor/lib/plugins/mobx/helpers'
// import type { Helpers } from '@mcro/decor/src/plugins/mobx/helpers'
import subscribable from '@mcro/decor/lib/plugins/react/subscribable'
// import type { Subscribable } from '@mcro/decor/src/plugins/react/subscribable'
import emitsMount from '@mcro/decor/lib/plugins/react/emitsMount'
import reactRenderArgs from '@mcro/decor/lib/plugins/react/reactRenderArgs'
// import type { ReactRenderArgs } from '@mcro/decor/src/plugins/react/reactRenderArgs'
import addContext from '@mcro/decor/lib/plugins/react/addContext'
import attach from '@mcro/decor/lib/plugins/react/attach'
import storeProvidable from '@mcro/decor/lib/plugins/react/storeProvidable'
import { storeOptions } from './store'
import { decorator as glossDecorator } from './gloss'
// import type { Glossy } from './gloss'
import typeof watch from './helpers/watch'

declare class ViewClass<Props, State> {
  props: $Abstract<Props>;
  state: $Abstract<State>;
  watch: watch;
  // emitter: typeof Emitter,
  emit(name: string, data: any): void;
  render(props: Props, state: State): React$Element<any>;
  subscriptions: Set<any>;
}

type View = ViewClass<any, any>
type Decoratable = Object | Class<any> | Function
type Decorator = (a: Decoratable) => View | ((opts: Object) => View)
type FancyDecoratorFactory = (a: Object) => Decorator

export type ViewDecorator = Decorator & {
  on(): View,
  ui(): View,
  basics(): View,
  provide(stores: Object): View,
  attach(...stores: Array<string>): View,
}

function createViewDecorator(): ViewDecorator {
  const uiContext = [
    addContext,
    {
      uiActiveThemeName: string,
      uiActiveTheme: object,
      uiThemes: object,
      ui: object,
    },
  ]

  const glossPlugin = () => ({ decorator: glossDecorator })

  type DecorationOpts = {
    mobx?: boolean,
    ui?: boolean,
    magic?: boolean,
  }

  // applied top to bottom
  const decorations = ({ mobx, ui, magic }: DecorationOpts = {}) => [
    extendsReact,
    subscribable,
    helpers,
    ui && uiContext,
    reactRenderArgs,
    mobx && observer,
    // gloss after mobx
    ui && glossPlugin,
    magic && automagical,
    [storeProvidable, storeOptions],
    !ui && emitsMount,
  ]

  const base: FancyDecoratorFactory = decor(
    decorations({ mobx: true, magic: false, ui: true })
  )

  const view = (item: Decoratable, ...args) => {
    if (typeof item === 'string') {
      return glossDecorator(item, ...args)
    }
    // @view({ ...stores }) shorthand
    if (typeof item === 'object') {
      const res: Decorator = base({ stores: item })
      return res
    }
    const res: View = base(item)
    return res
  }

  // pass on emitter
  view.emitter = base.emitter
  view.on = base.on
  view.off = base.off
  view.emit = base.emit

  // other decorators
  view.ui = decor(decorations({ ui: true }))
  view.electron = decor(decorations({ mobx: true, ui: false }))

  const providable = decor([[storeProvidable, storeOptions]])
  view.provide = stores => providable({ stores, context: true })
  view.provide.on = providable.on

  view.attach = (...names) => decor([[attach, { names }]])

  return view
}

export default createViewDecorator()
