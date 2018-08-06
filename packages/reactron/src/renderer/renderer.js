import Reconciler from 'react-reconciler'
import emptyObject from 'fbjs/lib/emptyObject'
import { createElement, getHostContextNode } from '../utils/createElement'
import * as ReactDOMFrameScheduling from './ReactDOMFrameScheduling'

const noop = () => {}
const CHILDREN = 'children'

// Calculate the diff between the two objects.
// See: https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
export function diffProps(pixiElement, type, lastRawProps, nextRawProps) {
  let updatePayload = null

  let lastProps = lastRawProps
  let nextProps = nextRawProps
  let propKey

  for (propKey in lastProps) {
    if (
      nextProps.hasOwnProperty(propKey) ||
      !lastProps.hasOwnProperty(propKey) ||
      lastProps[propKey] == null
    ) {
      continue
    }
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the whitelist in the commit phase instead.
      ;(updatePayload = updatePayload || []).push(propKey, null)
    }
  }
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey]
    const lastProp = lastProps != null ? lastProps[propKey] : undefined
    if (
      !nextProps.hasOwnProperty(propKey) ||
      nextProp === lastProp ||
      (nextProp == null && lastProp == null)
    ) {
      continue
    }
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the whitelist during the commit.
      ;(updatePayload = updatePayload || []).push(propKey, nextProp)
    }
  }
  return updatePayload
}

const UPDATE_SIGNAL = {}

export default Reconciler({
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child)
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
    return UPDATE_SIGNAL
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

  mutation: {
    appendChild(parentInstance, child) {
      if (child) {
        parentInstance.appendChild(child)
      }
    },

    appendChildToContainer(parentInstance, child) {
      if (child) {
        parentInstance.appendChild(child)
      }
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
      if (!instance) return
      instance.applyProps(newProps, oldProps)
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.children = newText
    },
  },
})
