// @flow
export default (options: Object, emitter) => ({
  name: 'extends-react',
  decorator: (Klass: Class<any> | Function) => {
    // functional components
    if (!Klass.prototype) {
      return Klass
    }
    const ogMount = Klass.prototype.componentDidMount
    Klass.prototype.componentDidMount = function(...args) {
      emitter.emit('view.mount', { name: this.constructor.name, thing: this })
      return ogMount && ogMount.call(this, ...args)
    }
    const ogUnmount = Klass.prototype.componentWillUnmount
    Klass.prototype.componentWillUnmount = function() {
      emitter.emit('view.unmount', { name: this.constructor.name, thing: this })
      return ogUnmount && ogUnmount.call(this, ...args)
    }
    return Klass
  },
})
