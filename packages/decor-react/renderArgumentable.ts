export function renderArgumentable() {
  return {
    name: 'react-render-args',
    once: true,
    onlyClass: true,
    decorator: (Klass: Function) => {
      if (!Klass.prototype.render) {
        console.log(Klass)
        throw new Error('Not a react-like class')
      }
      // preact-like render
      const or = Klass.prototype.render
      Klass.prototype.render = function() {
        return or.call(this, this.props, this.state, this.context)
      }
      return Klass
    },
  }
}
