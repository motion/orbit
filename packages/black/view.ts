import decor from '@mcro/decor'
import * as PropTypes from 'prop-types'
import extendsReact from '@mcro/decor/es6/plugins/react/extendsReact'
import observer from '@mcro/decor/es6/plugins/mobx/observer'
import automagical from '@mcro/automagical'
import helpers from '@mcro/decor/es6/plugins/mobx/helpers'
import subscribable from '@mcro/decor/es6/plugins/react/subscribable'
import emitsMount from '@mcro/decor/es6/plugins/react/emitsMount'
import reactRenderArgs from '@mcro/decor/es6/plugins/react/reactRenderArgs'
import addContext from '@mcro/decor/es6/plugins/react/addContext'
import attach from '@mcro/decor/es6/plugins/react/attach'
import storeProvidable from '@mcro/decor/es6/plugins/react/storeProvidable'
import { storeOptions } from './store'
import { decorator } from './gloss'

const uiContext = [
  addContext,
  {
    uiActiveThemeName: PropTypes.string,
    uiActiveTheme: PropTypes.object,
    uiThemes: PropTypes.object,
    ui: PropTypes.object,
  },
]

const glossPlugin = () => ({ decorator })
const decorations = (
  enable: { ui?: boolean; mobx?: boolean; magic?: boolean } = {},
) => [
  extendsReact,
  subscribable,
  helpers,
  enable.ui && uiContext,
  reactRenderArgs,
  enable.mobx && observer,
  // gloss after mobx
  enable.ui && glossPlugin,
  enable.magic && automagical,
  [storeProvidable, storeOptions],
  !enable.ui && emitsMount,
]
const base = decor(decorations({ mobx: true, magic: false, ui: true }))

interface ViewDecorator {
  (): any
  on: typeof base.on
  emitter: typeof base.emitter
  off: typeof base.off
  emit: typeof base.emit
  ui: typeof decor
  electron: typeof decor
  provide: any
  attach: any
}

function createViewDecorator() {
  const view = <ViewDecorator>function view(item, ...args) {
    if (typeof item === 'string') {
      return decorator(item, ...args)
    }
    // @view({ ...stores }) shorthand
    if (typeof item === 'object') {
      const res = base({ stores: item })
      return res
    }
    const res = base(item)
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

export const view = createViewDecorator()
