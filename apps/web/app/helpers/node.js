import view from './view'

export default Component => @view class {
  onDestroy = () => {
    const { node } = this.props
  }

  onChange = data => {
    const { node, editor } = this.props

    const next = editor
      .getState()
      .transform()
      .setNodeByKey(node.key, { data })
      .apply()

    editor.onChange(next)
  }

  render() {
    return (
      <Component
        onChange={this.onChange}
        onDestroy={this.onDestroy}
        {...this.props}
      />
    )
  }
}
