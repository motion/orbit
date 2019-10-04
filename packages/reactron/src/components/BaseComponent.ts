import { EventEmitter } from 'events'
import { isEqual } from 'lodash'

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
  mount?: Function
  handleNewProps(keys: string[], prev: Object): void
  update(): void
  update(prevProps?: Object): void
  emitter: EventEmitter
}

export class BaseComponent implements ReactronComponent {
  _id = `${this.constructor.name}${Math.random()}`
  emitter = new EventEmitter()
  parent = null
  children = []
  attachedHandlers = {}
  props = null
  root = null
  unmounted = false
  mounted = false

  mount() {
    // console.log('mount', this)
  }
  handleNewProps(_a, _b) {
    // console.log('new props', _a)
  }

  constructor(root, props) {
    this.root = root
    this.props = props
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

  update(oldProps?) {
    console.log('got update', this.props, oldProps)
    if (!this.mounted) {
      this.mount()
      this.mounted = true
    }
    const curPropKeys = Object.keys(this.props)
    const newPropKeys = !oldProps
      ? curPropKeys
      : curPropKeys.filter(k => !isEqual(this.props[k], oldProps[k]))
    if (newPropKeys.length) {
      this.handleNewProps.call(this, newPropKeys, oldProps)
    }
  }

  // helpers for events
  handleEvent(emitter: EventEmitter, key: string, val: any, wrapper = cb => cb()) {
    configureEventHandler(emitter, this.attachedHandlers, key, val, wrapper)
  }
}
