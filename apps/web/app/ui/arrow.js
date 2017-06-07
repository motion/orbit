import { view } from '@jot/helpers'

@view.ui
export default class Arrow {
  getRotation = () => {
    const { towards } = this.props
    switch (towards) {
      case 'left':
        return '-90deg'
      case 'right':
        return '90deg'
    }
    return '0deg'
  }

  render({ size, towards, theme }) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    return (
      <arrow $rotate={this.getRotation()} style={{ width: size, height: size }}>
        <arrowInner
          style={{
            top: innerTop * 0.75,
            width: size,
            height: size,
          }}
        />
      </arrow>
    )
  }

  static style = {
    arrow: {
      position: 'relative',
      overflow: 'hidden',
    },
    arrowInner: {
      background: '#fff',
      position: 'absolute',
      left: 0,
      borderRadius: 1,
      transform: 'rotate(45deg)',
    },
    rotate: amount => ({
      transform: {
        rotate: amount,
      },
    }),
  }

  static theme = {
    theme: (props, state, activeTheme) => ({
      arrowInner: activeTheme.base,
    }),
  }
}
