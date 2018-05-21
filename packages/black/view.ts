import decor from '@mcro/decor'
import * as PropTypes from 'prop-types'
import {
  storeProvidable,
  storeAttachable,
  extendsReact,
  contextual,
  renderArgumentable,
  emitsMount,
} from '@mcro/decor-react'
import { subscribable } from '@mcro/decor-classes'
import { reactable, reactObservable } from '@mcro/decor-mobx'
import automagical from '@mcro/automagical'
import { storeOptions } from './storeDecorator'
import { decorator } from './gloss'

const uiContext = [
  contextual,
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
  reactable,
  enable.ui && uiContext,
  renderArgumentable,
  enable.mobx && reactObservable,
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
  view.attach = (...names) => decor([[storeAttachable, { names }]])
  return view
}

export const view = createViewDecorator()
