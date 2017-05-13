import { view } from '~/helpers'

@view
export default class Title {
  static defaultProps = {
    tag: 'h1',
  }

  render() {
    const { tag, children, ...props } = this.props
    return React.createElement(tag, { $title: true, ...props }, children)
  }

  static style = {
    title: {
      fontWeight: 600,
      margin: ['0.5rem', 0],
      flexFlow: 'row',
      display: 'flex',
      whiteSpace: 'pre',
    },
  }

  static theme = {
    tag: ({ tag, size }) => {
      const reduce = 1 / +tag.slice(1)
      const fontSize = +size || 20 + reduce * 20
      return {
        title: {
          fontSize,
          lineHeight: `${1 + fontSize * 0.06}rem`,

          '&:hover': {
            color: tag === 'a' ? 'red' : 'auto',
          },
        },
      }
    },
    sans: {
      title: {
        fontFamily: 'Raleway',
      },
    },
    spaced: {
      title: {
        margin: ['1.5rem', 0],
      },
    },
  }
}
