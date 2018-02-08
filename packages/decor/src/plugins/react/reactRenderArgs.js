// @flow

// declare class ReactRenderArgs<Props, State, Context> {
//   props: $Abstract<Props>,
//   render(props: Props, state: State, context: Context): React$Element<any>,
// }

export default () => ({
  name: 'react-render-args',
  once: true,
  onlyClass: true,
  decorator: (Klass: Class<any> | Function) => {
    if (!Klass.prototype.render) {
      console.log(Klass)
      throw new Error('Not a react-like class')
    }
    // preact-like render
    const or = Klass.prototype.render
    Klass.prototype.render = function() {
      return or.call(this, this.props, this.state, this.context)
    }
    const ocDM = Klass.prototype.componentDidMount
    Klass.prototype.componentDidMount = function() {
      return ocDM.call(this, this.props, this.state, this.context)
    }
    const ocWM = Klass.prototype.componentWillMount
    Klass.prototype.componentWillMount = function() {
      return ocWM.call(this, this.props, this.state, this.context)
    }

    return Klass
  },
})
