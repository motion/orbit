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
}

export default Reconciler(HostConfig)
