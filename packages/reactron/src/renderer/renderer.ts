import Reconciler from 'react-reconciler'
import { unstable_cancelCallback as cancelDeferredCallback, unstable_now as now, unstable_scheduleCallback as scheduleDeferredCallback, unstable_shouldYield as shouldYield } from 'scheduler'

import { createElement, getHostContextNode } from '../utils/createElement'

const emptyObject = {}
const noop = () => {}

const HostConfig = {
  supportsMutation: true,
  isPrimaryRenderer: true,

  // hooks stuff:
  noTimeout: -1,
  scheduleTimeout: setTimeout,
  shouldYield,
  scheduleDeferredCallback,
  cancelDeferredCallback,
  now,

  // TODO remove this on next scheduler upgrade
  schedulePassiveEffects: scheduleDeferredCallback,
  cancelPassiveEffects: cancelDeferredCallback,

  shouldDeprioritizeSubtree() {
    return false
  },

  appendInitialChild(parent, child) {
    parent.appendChild(child)
  },

  createInstance(type, props) {
    return createElement(type, props)
  },

  createTextInstance(text) {
    return text
  },

  finalizeInitialChildren(instance, _type, props) {
    if (!instance) return
    instance.applyProps(props)
  },

  getPublicInstance(instance) {
    return instance
  },

  prepareUpdate() {
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

  commitUpdate(instance, _updatePayload, _type, oldProps, newProps) {
    if (!instance) return
    instance.applyProps.call(instance, newProps, oldProps)
  },

  commitTextUpdate(textInstance, _oldText, newText) {
    textInstance.children = newText
  },
}

export default Reconciler(HostConfig)
