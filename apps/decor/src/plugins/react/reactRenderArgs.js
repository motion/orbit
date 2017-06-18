export type ReactRenderArgs = {
  render(props: Object, state: Object, context: Object): ?React$Element<any>,
}

export default options => ({
  name: 'react-render-args',
  decorator: Klass => {
    // avoid fn classes
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
})
