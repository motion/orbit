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
    tag: ({ tag, size }) => {
      const reduce = 1 / tag.slice(1)
      const fontSize = +size || 20 + reduce * 20
      return {
          title: {
          fontSize,
          lineHeight: `${1 + fontSize * 0.06}rem`,
        },
      }
    },
  }
}
