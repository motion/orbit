import decor from '@mcro/decor'
import {
  storeProvidable,
  storeAttachable,
  renderArgumentable,
  emitsMount,
} from '@mcro/decor-react'
import { subscribable } from '@mcro/decor-classes'
import { reactObservable } from '@mcro/decor-mobx'
import { storeOptions } from './storeDecorator'
import { decorator } from './gloss'
// import { uiContext } from './uiContext'

import { DecorCompiledDecorator } from '@mcro/decor'
export { DecorPlugin, DecorCompiledDecorator } from '@mcro/decor'

const glossPlugin = () => ({
  onlyClass: true,
  decorator,
})

const decorations = (enable: { ui?: boolean; mobx?: boolean } = {}) => [
  subscribable,
  renderArgumentable,
  enable.ui && glossPlugin,
  enable.mobx && reactObservable,
  [storeProvidable, storeOptions],
  !enable.ui && emitsMount,
  // enable.ui && uiContext, // last as it wraps a HOC
]

export const blackDecorator: DecorCompiledDecorator<any> = decor(
  // @ts-ignore
  decorations({ mobx: true, ui: true }),
)

export interface ViewDecorator {
  (): any
  on: typeof blackDecorator.on
  emitter: typeof blackDecorator.emitter
  emit: typeof blackDecorator.emit
  ui: ReturnType<typeof decor>
  electron: ReturnType<typeof decor>
  provide: any
  attach: any
}

function createViewDecorator(): ViewDecorator {
  const view = <ViewDecorator>function view(item, ...args) {
    // view('div', { ...styles })
    if (typeof item === 'string') {
      return decorator(item, ...args)
    }
    // @view({ ...stores }) shorthand
    if (typeof item === 'object') {
      const res = blackDecorator({ stores: item })
      return res
    }
    const res = blackDecorator(item)
    return res
  }
  // pass on emitter
  view.emitter = blackDecorator.emitter
  view.on = blackDecorator.on
  view.emit = blackDecorator.emit
  // other decorators
  // @ts-ignore
  view.ui = decor(decorations({ ui: true }))
  // @ts-ignore
  view.electron = decor(decorations({ mobx: true, ui: false }))
  const providable = decor([[storeProvidable, storeOptions]])
  view.provide = stores => providable({ stores, context: true })
  view.provide.on = providable.on
  view.provide.emit = providable.emit
  // @ts-ignore
  view.attach = (...stores) => decor([[storeAttachable, { stores }]])
  return view
}

export const view: ViewDecorator = createViewDecorator()
