import * as Mobx from 'mobx'
import debug from '@mcro/debug'
import { Reaction } from './constants'
import { automagicReact } from './automagicReact'
import { MagicalObject } from './types'
import { Root } from './helpers'

// export @react decorator
export { react } from './react'
export {
  Reaction,
  ReactionRejectionError,
  ReactionTimeoutError,
} from './constants'
export * from './types'

const log = debug('automagical')

// TODO: fix deep() wrapper doesnt trigger reactions when mutating objects
// so basically this.reactiveObj.x = 1, wont trigger react(() => this.reactiveObj)

const isFunction = val => typeof val === 'function'
const isWatch = (val: any) => val && val.IS_AUTO_RUN

export function automagicClass() {
  if (!this.__automagical) {
    this.__automagical = {}
  }
  if (!this.__automagical.started) {
    decorateClassWithAutomagic(this)
    if (this.__automagical.watchers) {
      for (const watcher of this.__automagical.watchers) {
        watcher()
      }
    }
    this.__automagical.started = true
  }
}

export default function automagical() {
  return {
    name: 'automagical',
    decorator: (Klass: Function) => {
      if (!Klass.prototype.automagic) {
        Klass.prototype.automagic = automagicClass
      }
      return Klass
    },
  }
}

const FILTER_KEYS = {
  __automagical: true,
  automagic: true,
  constructor: true,
  dispose: true,
  props: true,
  ref: true,
  render: true,
  setInterval: true,
  setTimeout: true,
  subscriptions: true,
  emitter: true,
  emit: true,
  on: true,
}

function collectGetterPropertyDescriptors(proto) {
  const fproto = Object.getOwnPropertyNames(proto).filter(
    x => !FILTER_KEYS[x] && x[0] !== '_',
  )
  return fproto.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: Object.getOwnPropertyDescriptor(proto, cur),
    }),
    {},
  )
}

function getAutoRunDescriptors(obj) {
  const protoDescriptors = collectGetterPropertyDescriptors(
    Object.getPrototypeOf(obj),
  )
  return Object.keys(protoDescriptors)
    .filter(
      key => protoDescriptors[key].get && protoDescriptors[key].get.IS_AUTO_RUN,
    )
    .reduce((a, b) => ({ ...a, [b]: protoDescriptors[b] }), {})
}

function decorateClassWithAutomagic(obj: MagicalObject) {
  const descriptors = {
    ...Object.keys(obj).reduce(
      (a, b) => ({ ...a, [b]: Object.getOwnPropertyDescriptor(obj, b) }),
      {},
    ),
    ...getAutoRunDescriptors(obj),
  }
  const decorations = {}
  for (const method of Object.keys(descriptors)) {
    if (FILTER_KEYS[method]) {
      continue
    }
    const decor = decorateMethodWithAutomagic(obj, method, descriptors[method])
    if (decor) {
      decorations[method] = decor
    }
  }
  Mobx.decorate(obj, decorations)
}

// * => mobx
function decorateMethodWithAutomagic(
  target: MagicalObject,
  method: string,
  descriptor: PropertyDescriptor,
) {
  // non decorator reactions
  if (descriptor && descriptor.value) {
    if (descriptor.value instanceof Reaction) {
      const reaction = descriptor.value
      automagicReact(target, method, reaction.reaction, reaction.options)
      return
    }
    if (descriptor.value.__IS_DEEP) {
      delete descriptor.value.__IS_DEEP
      return Mobx.observable.deep
    }
  }
  if (descriptor && (!!descriptor.get || !!descriptor.set)) {
    return Mobx.computed
  }
  if (target.__automagical.deep && target.__automagical.deep[method]) {
    return Mobx.observable.deep
  }
  let value = target[method]
  // @watch: autorun |> automagical (value)
  if (isWatch(value)) {
    automagicReact(
      target,
      method,
      value,
      typeof value.IS_AUTO_RUN === 'object' ? value.IS_AUTO_RUN : undefined,
    )
    return
  }
  if (isFunction(value)) {
    const NAME = `${target.constructor.name}.${method}`
    // autobind
    const targetMethod = target[method].bind(target)
    // wrap for logging helpers
    target[method] = (...args) => {
      if (Root.__shouldLog && Root.__shouldLog[NAME]) {
        log(NAME, ...args)
      }
      return targetMethod(...args)
    }
    // actionize
    return Mobx.action
  }
  if (Mobx.isObservable(target[method])) {
    return
  }
  return Mobx.observable.ref
}
