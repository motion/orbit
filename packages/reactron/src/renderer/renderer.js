import Reconciler from 'react-reconciler'
import { createElement, getHostContextNode } from '../utils/createElement'
import * as ReactDOMFrameScheduling from './ReactDOMFrameScheduling'

const emptyObject = {}
const noop = () => {}

export default Reconciler({
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
    return false
  },

  getPublicInstance(instance) {
    return instance
  },

  prepareForCommit: noop,

  // prepareUpdate() {
  //   return true
  // },

  prepareUpdate(instance, type, oldProps, newProps) {
    instance.applyProps(newProps, oldProps)
    return true
  },

  resetAfterCommit: noop,
  resetTextContent: noop,

  getRootHostContext(instance) {
    return getHostContextNode(instance)
  },

  getChildHostContext() {
    return emptyObject
  },

  shouldSetTextContent(/*type, props */) {
    return false
  },

  now: ReactDOMFrameScheduling.now,
  // scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
  // useSyncScheduling: true,

  appendChild(parent, child) {
    if (child) {
      parent.appendChild(child)
    }
  },

  appendChildToContainer(parent, child) {
    parent.appendChild(child)
  },

  removeChild(parent, child) {
    parent.removeChild(child)
  },

  removeChildFromContainer(parent, child) {
    parent.removeChild(child)
  },

  insertBefore: noop,
  commitMount: noop,

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    if (!instance) return
    instance.applyProps.call(instance, newProps, oldProps)
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.children = newText
  },
})
