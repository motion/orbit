import { view } from '@mcro/black'

@view
export default class Circle {
  static defaultProps = {
    size: 45,
  }

  render({ size, ...props }) {
    return <circle {...props} />
  }

  static style = {
    circle: {
      display: 'flex',
      fontSize: 30,
      borderRadius: 100,
      lineHeight: '1rem',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      background: '#fff',

      color: '#111',
      fontWeight: 400,
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all ease-in 100ms',

      '&:hover': {
        background: '#efefef',
      },
    },
  }

  static theme = ({ size }) => ({
    circle: {
      width: size,
      height: size,
    },
  })
}
