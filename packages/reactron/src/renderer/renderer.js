import Reconciler from 'react-reconciler'
import { createElement, getHostContextNode } from '../utils/createElement'

const emptyObject = {}
const noop = () => {}

// function traceWrap(hostConfig) {
//   let traceWrappedHostConfig = {}
//   Object.keys(hostConfig).map(key => {
//     const func = hostConfig[key]
//     traceWrappedHostConfig[key] = (...args) => {
//       console.trace(key)
//       return func(...args)
//     }
//   })
//   return traceWrappedHostConfig
// }

let scheduledCallback = null
let scheduledCallbackTimeout = -1
let scheduledPassiveCallback = null
let elapsedTimeInMs = 0

const HostConfig = {
  now: Date.now,
  supportsMutation: true,

  appendInitialChild(parent, child) {
    parent.appendChild(child)
  },

  createInstance(type, props) {
    return createElement(type, props)
  },

  createTextInstance(text) {
    return text
  },

  finalizeInitialChildren(instance, type, props) {
    if (!instance) return
    instance.applyProps(props)
    // return false
  },

  getPublicInstance(instance) {
    return instance
  },

  // prepareUpdate() {
  //   return true
  // },

  prepareUpdate(instance, type, oldProps, newProps) {
    instance.applyProps(newProps, oldProps)
    return emptyObject
  },

  prepareForCommit: noop,
  resetAfterCommit: noop,
  resetTextContent: noop,

  getRootHostContext(instance) {
    return getHostContextNode(instance)
  },

  getChildHostContext() {
    return emptyObject
  },

  shouldSetTextContent() {
    return false
  },

  appendChild(parent, child) {
    if (child) {
      parent.appendChild(child)
    }
  },

  appendChildToContainer(parent, child) {
    if (child) {
      parent.appendChild(child)
    }
  },

  removeChild(parent, child) {
    parent.removeChild(child)
  },

  removeChildFromContainer(parent, child) {
    parent.removeChild(child)
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    if (!instance) return
    instance.applyProps.call(instance, newProps, oldProps)
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.children = newText
  },

  schedulePassiveEffects(callback) {
    if (scheduledCallback) {
      throw new Error(
        'Scheduling a callback twice is excessive. Instead, keep track of ' +
          'whether the callback has already been scheduled.',
      )
    }
    scheduledPassiveCallback = callback
  },

  cancelPassiveEffects() {
    if (scheduledPassiveCallback === null) {
      throw new Error('No passive effects callback is scheduled.')
    }
    scheduledPassiveCallback = null
  },

  scheduleDeferredCallback(callback, options) {
    if (scheduledCallback) {
      throw new Error(
        'Scheduling a callback twice is excessive. Instead, keep track of ' +
          'whether the callback has already been scheduled.',
      )
    }
    scheduledCallback = callback
    if (typeof options === 'object' && options !== null && typeof options.timeout === 'number') {
      const newTimeout = options.timeout
      if (scheduledCallbackTimeout === -1 || scheduledCallbackTimeout > newTimeout) {
        scheduledCallbackTimeout = elapsedTimeInMs + newTimeout
      }
    }
    return 0
  },
}

export default Reconciler(HostConfig)
