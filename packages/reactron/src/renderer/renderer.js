import Reconciler from 'react-reconciler'
import emptyObject from 'fbjs/lib/emptyObject'
import { createElement, getHostContextNode } from '../utils/createElement'
import * as ReactDOMFrameScheduling from './ReactDOMFrameScheduling'

const UPDATE_SIGNAL = {}

export default Reconciler({
  appendInitialChild(parentInstance, child) {
    console.log('appendInitialChild', parentInstance)
    if (parentInstance.appendChild) {
      parentInstance.appendChild(child)
    } else {
      parentInstance.document = child
    }
  },

  createInstance(type, props, internalInstanceHandle) {
    return createElement(type, props)
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    return text
  },

  finalizeInitialChildren(element, type, props) {
    return false
  },

  getPublicInstance(instance) {
    return instance
  },

  prepareForCommit() {
    // noop
  },

  prepareUpdate(element, type, oldProps, newProps) {
    return UPDATE_SIGNAL
  },

  resetAfterCommit() {
    // noop
  },

  resetTextContent(element) {
    // noop
  },

  // Use this current instance to pass data from root
  getRootHostContext(instance) {
    // getHostContextNode here updates the internal state of createElement and stores a ref to current instance
    return getHostContextNode(instance)
  },

  getChildHostContext() {
    return emptyObject
  },

  shouldSetTextContent(type, props) {
    return false // Redocx does not have a text node like DOM
  },

  now: ReactDOMFrameScheduling.now,
  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
  useSyncScheduling: true,

  mutation: {
    appendChild(parentInstance, child) {
      if (parentInstance.appendChild) {
        parentInstance.appendChild(child)
      }
    },

    appendChildToContainer(parentInstance, child) {
      if (parentInstance.appendChild) {
        parentInstance.appendChild(child)
      }
    },

    removeChild(parentInstance, child) {
      parentInstance.removeChild(child)
    },

    removeChildFromContainer(parentInstance, child) {
      parentInstance.removeChild(child)
    },

    insertBefore(parentInstance, child, beforeChild) {
      // noob
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      instance._applyProps(instance, newProps, oldProps)
    },

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      // noop
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.children = newText
    },
  },
})
