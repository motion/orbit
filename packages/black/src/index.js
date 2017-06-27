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

// model helpers
export {
  bool,
  array,
  object,
  str,
  nil,
  oneOf,
  compile,
} from './model/properties'

import type { ViewClass } from './view'
export type ViewType = ViewClass

import type { StoreClass } from './store'
export type StoreType = StoreClass

export color from 'color'

export * from './constants'
