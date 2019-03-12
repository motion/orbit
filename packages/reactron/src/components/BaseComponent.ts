import isEqual from 'lodash.isequal'
import configureEventHandler from '../utils/configureEventHandler'

// sort of like our own mini react API

const NOT_NEW = '__NOT_NEW__'

interface ReactronComponent {
  unmounted: boolean
  _id: any
  root: any
  props: any
  parent: any
  children: any
  attachedHandlers: any
  mount: Function
  handleNewProps(keys: string[], prev: Object): void
  update(): void
  update(prevProps?: Object): void
}

export class BaseComponent implements ReactronComponent {
  _id = `${this.constructor.name}${Math.random()}`
  parent = null
  children = []
  attachedHandlers = {}
  props = null
  root = null
  unmounted = true

  mount() {}
  handleNewProps(_a, _b) {}

  constructor(root, props) {
    this.root = root
    this.props = props
    this.unmounted = false
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

  commitUpdate(_instance, _updatePayload, _type, lastRawProps, nextRawProps) {
    this.applyProps(lastRawProps, nextRawProps)
  }

  applyProps(newProps = {}, oldProps) {
    this.props = newProps
    this.update(oldProps)
  }

  update(prevProps?) {
    const currentPropKeys = Object.keys(this.props)
    const newPropKeys = !prevProps
      ? currentPropKeys
      : currentPropKeys
          .map(k => (!isEqual(this.props[k], prevProps[k]) ? k : NOT_NEW))
          .filter(x => x !== NOT_NEW)
    this.handleNewProps(newPropKeys, prevProps)
  }

  // helpers for events
  handleEvent(emitter, key, val, wrapper = cb => cb()) {
    configureEventHandler(emitter, this.attachedHandlers, key, val, wrapper)
  }
}
