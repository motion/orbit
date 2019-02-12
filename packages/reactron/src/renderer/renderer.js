import Reconciler from 'react-reconciler'
import { createElement, getHostContextNode } from '../utils/createElement'

const emptyObject = {}
const noop = () => {}

let scheduledCallback = null
function setTimeoutCallback() {
  const callback = scheduledCallback
  scheduledCallback = null
  if (callback !== null) {
    callback()
  }
}
function scheduleDeferredCallback(callback) {
  scheduledCallback = callback
  const timeoutId = setTimeout(setTimeoutCallback, 1)
  return timeoutId
}
function cancelDeferredCallback(callbackID) {
  scheduledCallback = null
  clearTimeout(callbackID)
}

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

  schedulePassiveEffects: scheduleDeferredCallback,
  cancelPassiveEffects: cancelDeferredCallback,
}

export default Reconciler(HostConfig)
