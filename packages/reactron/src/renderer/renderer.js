import Reconciler from 'react-reconciler'
import {
  unstable_cancelCallback as cancelDeferredCallback,
  unstable_scheduleCallback as scheduleDeferredCallback,
} from 'scheduler'
import { createElement, getHostContextNode } from '../utils/createElement'
export {
  unstable_cancelCallback as cancelDeferredCallback,
  unstable_now as now,
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_shouldYield as shouldYield,
} from 'scheduler'

const emptyObject = {}
const noop = () => {}

const HostConfig = {
  now: Date.now,
  supportsMutation: true,

  // hooks stuff:
  noTimeout: -1,
  scheduleTimeout: setTimeout,
  schedulePassiveEffects: scheduleDeferredCallback,
  cancelPassiveEffects: cancelDeferredCallback,

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
}

export default Reconciler(HostConfig)
