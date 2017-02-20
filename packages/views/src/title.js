import { view } from 'my-decorators'

@view
export default class Title {
  static defaultProps = {
    tag: 'h1'
  }

  render() {
    const { tag, children } = this.props
    return (
      React.createElement(tag, { '$title': true },
        children
      )
    )
  }

  static style = {
    title: {
      margin: [20, 0],
    }
  }
}
