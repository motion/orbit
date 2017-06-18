import { view } from '@jot/black'

export type Props = {
  size: number,
  towards: 'top' | 'right' | 'bottom' | 'left',
}

@view.ui
export default class Arrow {
  props: Props

  static defaultProps = {
    size: 16,
    towards: 'bottom',
  }

  getRotation = towards => {
    switch (towards) {
      case 'left':
        return '-90deg'
      case 'right':
        return '90deg'
    }
    return '0deg'
  }

  render({ size, towards, theme, ...props }: Props) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)

    return (
      <arrow $rotate={this.getRotation(towards)} {...props}>
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
    theme: ({ size }, state, activeTheme) => ({
      arrowInner: activeTheme.base,
      arrow: {
        width: size,
        height: size,
      },
    }),
  }
}
