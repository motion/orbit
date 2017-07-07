// @flow

export view from './view'
export store from './store'

export Model from './model/model'
export query from './model/query'

export { Shortcuts, ShortcutManager } from './shortcuts'

export gloss, { createElement } from './gloss'
export log from './helpers/log'
export watch from './helpers/watch'
export inject from './helpers/inject'
export getTarget from './helpers/getTarget'
export keycode from './helpers/keycode'

// mobx helpers
export { computed, observable, autorun, react, isObservable } from 'mobx'

// schema helpers
export {
  bool,
  array,
  object,
  str,
  nil,
  oneOf,
  compile,
} from './model/properties'
import { compile } from 'kontur'
import validator from 'is-my-json-valid'
export const schema = obj => validator(compile(obj))

// ViewType
import type { ViewClass } from './view'
export type ViewType = ViewClass

// StoreType
import type { StoreClass } from './store'
export type StoreType = StoreClass

// constants
export * from './constants'
