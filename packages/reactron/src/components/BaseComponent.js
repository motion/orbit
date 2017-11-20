import isEqual from 'lodash.isequal'

// sort of like our own mini react API

export default class BaseComponent {
  parent = null
  children = []

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
    this.children.splice(index, 1)
  }

  applyProps(newProps, oldProps) {
    console.log('apply new props', newProps)
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
}
