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
    // short: view({ ...styles }), view('div', { ...styles })
    if (typeof item === 'string' || typeof item === 'object') {
      return decorator(item, ...args)
    }
    // class/function
    return blackDecorator(item)
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
  view.attach = (...stores) => {
    // this allows attaching stores locally
    if (typeof stores[0] === 'object') {
      return blackDecorator({ stores: stores[0] })
    }
    // and this allows attaching contextual stores
    // @ts-ignore
    return decor([[storeAttachable, { stores }]])
  }
  return view
}

export const view: ViewDecorator = createViewDecorator()
