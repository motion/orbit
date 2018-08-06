import isEqual from 'lodash.isequal'
import configureEventHandler from '../utils/configureEventHandler'

// sort of like our own mini react API

const NOT_NEW = '__NOT_NEW__'

export class BaseComponent {
  constructor(root, props) {
    this._id = `${this.constructor.name}${Math.random()}`
    this.root = root
    this.props = props
    this.parent = null
    this.children = []
    this.attachedHandlers = {}
    if (this.mount) {
      this.unmounted = true
      this.mount()
      this.unmounted = false
    }
  }

  appendChild(child) {
    if (typeof child !== 'object') {
      console.log('not a reactron child', child)
      return
    }
    this.children.push(child)
    child.parent = this
  }

  removeChild(child) {
    const index = this.children.indexOf(child)
    delete child.parent
    if (child.unmount) {
      child.unmount()
    }
    child.unmounted = true
    for (const key of Object.keys(child.attachedHandlers)) {
      const { emitter, handler } = child.attachedHandlers[key]
      emitter.removeListener(key, handler)
    }
    this.children.splice(index, 1)
  }

  commitUpdate(instance, updatePayload, type, lastRawProps, nextRawProps) {
    this.applyProps(lastRawProps, nextRawProps)
  }

  applyProps(newProps = {}, oldProps) {
    this.props = newProps
    this.update(oldProps)
  }

  update(prevProps) {
    const currentPropKeys = Object.keys(this.props)
    const newPropKeys = !prevProps
      ? currentPropKeys
      : currentPropKeys
          .map(k => (!isEqual(this.props[k], prevProps[k]) ? k : NOT_NEW))
          .filter(x => x !== NOT_NEW)
    if (this.handleNewProps) {
      this.handleNewProps(newPropKeys, prevProps)
    }
  }

  // helpers for events
  handleEvent(emitter, key, val, wrapper = cb => cb()) {
    configureEventHandler(emitter, this.attachedHandlers, key, val, wrapper)
  }
}
