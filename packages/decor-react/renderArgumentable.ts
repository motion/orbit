export function renderArgumentable() {
  return {
    name: 'react-render-args',
    once: true,
    onlyClass: true,
    decorator: (Klass: Function) => {
      if (!Klass.prototype || !Klass.prototype.render) {
        return Klass
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
