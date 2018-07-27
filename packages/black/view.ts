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
import createGloss, {
  isGlossArguments,
  GLOSS_IGNORE_COMPONENT_SYMBOL,
} from '@mcro/gloss'
import { DecorCompiledDecorator } from '@mcro/decor'

export { DecorPlugin, DecorCompiledDecorator } from '@mcro/decor'

export interface ViewDecorator {
  (a?: string | Function | Object, b?: Object): any
  on: typeof blackDecorator.on
  emitter: typeof blackDecorator.emitter
  emit: typeof blackDecorator.emit
  ui: ReturnType<typeof decor>
  electron: ReturnType<typeof decor>
  provide: any
  attach: any
}

const decorations = (enable: { ui?: boolean; mobx?: boolean } = {}) => [
  subscribable,
  renderArgumentable,
  enable.mobx && reactObservable,
  [storeProvidable, storeOptions],
  !enable.ui && emitsMount,
]

export const blackDecorator: DecorCompiledDecorator<any> = decor(
  // @ts-ignore
  decorations({ mobx: true, ui: true }),
)

function createViewDecorator(): ViewDecorator {
  const { createView } = createGloss()

  const view = <ViewDecorator>function view(a?, b?) {
    // simple views: view(), view({}), view('div', {}), view(OtherView, {})
    if (isGlossArguments(a, b)) {
      return createView(a, b)
    }
    const View = a as Function
    // class views
    // patch this in for now...
    const shouldPatchConfig = !View.prototype && !View['withConfig']
    let aFinal
    if (shouldPatchConfig) {
      a['withConfig'] = function(config) {
        if (config.displayName) {
          a['displayName'] = config.displayName
        }
        return aFinal
      }
    }
    // class/function
    aFinal = blackDecorator(a)
    return aFinal
  }
  // pass on emitter
  view.emitter = blackDecorator.emitter
  view.on = blackDecorator.on
  view.emit = blackDecorator.emit
  // other decorators
  view.ui = decor(decorations({ ui: true }))
  view.electron = decor(decorations({ mobx: true, ui: false }))
  const providable = decor([[storeProvidable, storeOptions]])
  view.provide = stores => providable({ stores, context: true })
  view.provide.on = providable.on
  view.provide.emit = providable.emit
  view.attach = (...stores) => {
    // this allows attaching stores locally
    if (typeof stores[0] === 'object') {
      return blackDecorator({
        stores: stores[0],
        [GLOSS_IGNORE_COMPONENT_SYMBOL]: true,
      })
    }
    // and this allows attaching contextual stores
    // @ts-ignore
    return decor([[storeAttachable, { stores }]])
  }
  return view
}

export const view: ViewDecorator = createViewDecorator()
