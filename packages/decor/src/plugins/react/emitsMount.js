import type { Helpers } from '../index'

// @flow
export default (options: Object, Helpers: Helpers) => ({
  name: 'extends-react',
  once: true,
  onlyClass: true,
  decorator: (Klass: Class<any> | Function) => {
    const ogMount = Klass.prototype.componentDidMount
    Klass.prototype.componentDidMount = function(...args) {
      Helpers.emitter.emit('view.mount', {
        name: this.constructor.name,
        thing: this,
      })
      return ogMount && ogMount.call(this, ...args)
    }
    const ogUnmount = Klass.prototype.componentWillUnmount
    Klass.prototype.componentWillUnmount = function() {
      Helpers.emitter.emit('view.unmount', {
        name: this.constructor.name,
        thing: this,
      })
      return ogUnmount && ogUnmount.call(this, ...args)
    }
    return Klass
  },
})
