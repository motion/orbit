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
      fontFamily: 'Playfair Display, serif',
      margin: [20, 0],
    }
  }

  static theme = {
    tag: ({ tag }) => ({
      title: {
        fontSize: 20 + tag.slice(1) * 25,
        lineHeight: `${2.5 + tag.slice(1) * 0.5}rem`,
      },
    }),
  }
}
