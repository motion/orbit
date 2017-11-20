import isEqual from 'lodash.isequal'
import configureEventHandler from '../utils/configureEventHandler'

// sort of like our own mini react API

export default class BaseComponent {
  parent = null
  children = []
  attachedHandlers = {}

  constructor(root, props) {
    this.root = root
    this.props = props
    if (this.mount) {
      this.mount()
    }
    if (this.handleNewProps) {
      this.handleNewProps(Object.keys(this.props))
    }
  }

  appendChild(child) {
    this.children.push(child)
  }

  removeChild(child) {
    const index = this.children.indexOf(child)
    child.parent = null
    if (child.unmount) {
      child.unmount()
    }
    this.children.splice(index, 1)
  }

  applyProps(newProps, oldProps) {
    this.props = newProps
    this.update(oldProps)
  }

  update(prevProps) {
    const newPropKeys = Object.keys(this.props).map(
      k => !isEqual(this.props[k], prevProps[k])
    )
    if (this.handleNewProps) {
      this.handleNewProps(newPropKeys)
    }
  }

  // helpers for events
  handleEvent(emitter, key, val, wrapper = cb => cb()) {
    configureEventHandler(emitter, this.attachedHandlers, key, val, wrapper)
  }
}
