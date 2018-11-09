import * as Mobx from 'mobx'
import { Reaction } from './constants'
import { automagicReact } from './automagicReact'
import { MagicalObject } from './types'
import { Root } from './helpers'
import { Logger } from '@mcro/logger'

// export @react decorator
export { react } from './react'
export { ensure } from './ensure'
export { cancel } from './cancel'
export { Reaction, ReactionRejectionError, ReactionTimeoutError } from './constants'
export * from './types'

// this lets you "always" react to any values you give as arguments without bugs
export const always = ((() => Math.random()) as unknown) as (...args: any[]) => number

const log = new Logger('automagical')

// TODO: fix deep() wrapper doesnt trigger reactions when mutating objects
// so basically this.reactiveObj.x = 1, wont trigger react(() => this.reactiveObj)

const isFunction = val => typeof val === 'function'
const isWatch = (val: any) => val && val.IS_AUTO_RUN

export type AutomagicOptions = {
  isSubscribable?: (a: any) => boolean
}

export function automagicClass(options: AutomagicOptions = {}) {
  if (!this.__automagical) {
    this.__automagical = {}
  }
  if (!this.__automagical.started) {
    decorateClassWithAutomagic(this, options)
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
  render: true,
  subscriptions: true,
}

function collectGetterPropertyDescriptors(proto) {
  const fproto = Object.getOwnPropertyNames(proto).filter(x => !FILTER_KEYS[x] && x[0] !== '_')
  const res = {}
  for (const key of fproto) {
    res[key] = Object.getOwnPropertyDescriptor(proto, key)
  }
  return res
}

function getAutoRunDescriptors(obj) {
  const protoDescriptors = collectGetterPropertyDescriptors(Object.getPrototypeOf(obj))
  const keys = Object.keys(protoDescriptors).filter(
    key => protoDescriptors[key].get && protoDescriptors[key].get.IS_AUTO_RUN,
  )
  const res = {}
  for (const key of keys) {
    res[key] = protoDescriptors[key]
  }
  return res
}

function decorateClassWithAutomagic(obj: MagicalObject, options: AutomagicOptions) {
  let descriptors = {}
  for (const key of Object.keys(obj)) {
    descriptors[key] = Object.getOwnPropertyDescriptor(obj, key)
  }
  descriptors = {
    ...descriptors,
    ...getAutoRunDescriptors(obj),
  }
  const decorations = {}
  for (const method in descriptors) {
    if (FILTER_KEYS[method]) {
      continue
    }
    const decor = decorateMethodWithAutomagic(obj, method, descriptors[method], options)
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
  options: AutomagicOptions,
) {
  // non decorator reactions
  if (descriptor && descriptor.value) {
    if (descriptor.value instanceof Reaction) {
      const reaction = descriptor.value
      automagicReact(target, method, reaction.reaction, reaction.options, options)
      return
    }
    if (descriptor.value.__IS_DEEP) {
      target.__automagical.deep = target.__automagical.deep || {}
      target.__automagical.deep[method] = true
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
      options,
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
        log.info(NAME, ...args)
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
