import Reconciler from 'react-reconciler'
import emptyObject from 'fbjs/lib/emptyObject'
import { createElement, getHostContextNode } from '../utils/createElement'
import * as ReactDOMFrameScheduling from './ReactDOMFrameScheduling'

const noop = () => {}

export default Reconciler({
  appendInitialChild(parentInstance, child) {
    console.log('appendInitialChild', parentInstance)
    if (parentInstance.appendChild) {
      parentInstance.appendChild(child)
    } else {
      parentInstance.document = child
    }
  },

  createInstance(type, props) {
    return createElement(type, props)
  },

  createTextInstance(text) {
    return text
  },

  finalizeInitialChildren(element, type, props) {
    return false
  },

  getPublicInstance(instance) {
    return instance
  },

  prepareForCommit: noop,

  prepareUpdate(element, type, oldProps, newProps) {
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

  shouldSetTextContent(type, props) {
    return false
  },

  now: ReactDOMFrameScheduling.now,
  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
  useSyncScheduling: true,

  mutation: {
    appendChild(parentInstance, child) {
      if (parentInstance.appendChild) {
        parentInstance.appendChild(child)
      }
      child.parent = parentInstance
    },

    appendChildToContainer(parentInstance, child) {
      if (parentInstance.appendChild) {
        parentInstance.appendChild(child)
      }
      child.parent = parentInstance
    },

    removeChild(parentInstance, child) {
      parentInstance.removeChild(child)
    },

    removeChildFromContainer(parentInstance, child) {
      parentInstance.removeChild(child)
    },

    insertBefore: noop,
    commitMount: noop,

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      instance.applyProps(newProps, oldProps)
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.children = newText
    },
  },
})
