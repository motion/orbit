import { Helpers } from '@mcro/decor'

export default function emitsMount(_, Helpers: Helpers) {
  return {
    name: 'extends-react',
    once: true,
    onlyClass: true,
    decorator: (Klass: Function) => {
      const ogMount = Klass.prototype.componentDidMount
      Klass.prototype.componentDidMount = function(...args) {
        Helpers.emit('view.mount', {
          name: this.constructor.name,
          thing: this,
        })
        return ogMount && ogMount.call(this, ...args)
      }
      const ogUnmount = Klass.prototype.componentWillUnmount
      Klass.prototype.componentWillUnmount = function(...args) {
        Helpers.emit('view.unmount', {
          name: this.constructor.name,
          thing: this,
        })
        return ogUnmount && ogUnmount.call(this, ...args)
      }
      return Klass
    },
  }
}
