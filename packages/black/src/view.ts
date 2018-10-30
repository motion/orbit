import decor from '@mcro/decor'
import { storeProvidable, storeAttachable, emitsMount } from '@mcro/decor-react'
import { subscribable } from '@mcro/decor-classes'
import { reactObservable } from '@mcro/decor-mobx'
import { storeOptions } from './storeDecorator'
import createGloss, {
  SimpleView,
  GLOSS_IGNORE_COMPONENT_SYMBOL,
  CSSPropertySet,
  isGlossArguments,
} from '@mcro/gloss'
import { DecorCompiledDecorator } from '@mcro/decor'

type SimpleViewDecorator<
  A extends string | Function | CSSPropertySet,
  B extends CSSPropertySet
> = ((
  a?: A,
  b?: B,
) => A extends string | CSSPropertySet ? SimpleView : B extends CSSPropertySet ? SimpleView : any)

const decorations = (enable: { ui?: boolean; mobx?: boolean } = {}) => [
  subscribable,
  enable.mobx && reactObservable,
  [storeProvidable, storeOptions],
  emitsMount,
]
const blackDecorator: DecorCompiledDecorator<any> = decor(decorations({ mobx: true, ui: true }))
const { createView } = createGloss()

// @view
export const view = <SimpleViewDecorator<any, any>>function view(a?, b?) {
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

// @provide
const providable = decor([[storeProvidable, storeOptions]])
export const provide = stores => providable({ stores, context: true })

// @attach
export const attach = (...stores) => {
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

export const viewEmitter = {
  on: (action, cb) => {
    const off = blackDecorator.on(action, cb)
    const off2 = providable.on(action, cb)
    return {
      dispose: () => {
        off.dispose()
        off2.dispose()
      },
    }
  },
  emit: action => {
    blackDecorator.emit(action)
    providable.emit(action)
  },
}
