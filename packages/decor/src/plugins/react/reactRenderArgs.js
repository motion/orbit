// @flow
declare class ReactRenderArgs<Props, State, Context> {
  props: $Abstract<Props>,
  render(props: Props, state: State, context: Context): React$Element<any>,
}

export default (options: Object) => ({
  name: 'react-render-args',
  decorator: (Klass: Class<any> | Function) => {
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
