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

export const decorBase = decor(
  decorations({ mobx: true, magic: false, ui: true }),
)

export interface ViewDecorator {
  (): any
  on: typeof decorBase.on
  emitter: typeof decorBase.emitter
  off: typeof decorBase.off
  emit: typeof decorBase.emit
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
      const res = decorBase({ stores: item })
      return res
    }
    const res = decorBase(item)
    return res
  }
  // pass on emitter
  view.emitter = decorBase.emitter
  view.on = decorBase.on
  view.off = decorBase.off
  view.emit = decorBase.emit
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
