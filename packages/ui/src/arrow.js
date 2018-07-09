import * as React from 'react'
import { view, attachTheme } from '@mcro/black'

// export type Props = {
//   size: number,
//   towards: 'top' | 'right' | 'bottom' | 'left',
//   theme?: string | Object,
//   boxShadow?: any,
//   background?: Color,
// }

@attachTheme
@view.ui
export class Arrow extends React.Component {
  static defaultProps = {
    size: 16,
    towards: 'bottom',
  }

  render({
    size,
    towards,
    onClick,
    background,
    boxShadow,
    opacity,
    style,
    border,
  }) {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)
    const transform = {
      right: { rotate: '90deg' },
      bottom: { rotate: '0deg' },
      left: { rotate: '-90deg', x: 0, y: -10 },
      top: { rotate: '0deg' },
    }[towards]
    const rotate = {
      left: '0deg',
      right: '0deg',
      bottom: '0deg',
      top: '0deg',
    }[towards]
    return (
      <div onClick={onClick} style={style}>
        <div
          $arrowOuter
          css={{ transform }}
          style={{
            width: size,
            height: size,
          }}
        >
          <div
            css={{
              transform: { rotate: rotate },
              width: size,
              height: size,
            }}
          >
            <div
              $arrowInner
              css={{
                top: innerTop * 0.75,
                width: size,
                height: size,
                boxShadow,
                opacity,
                border,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  static style = {
    // why arrowOuter and arrow? Because chrome transform rotate destroy overflow: hidden, so we nest one more
    arrowOuter: {
      position: 'relative',
      overflow: 'hidden',
    },
    arrowInner: {
      position: 'absolute',
      left: 0,
      borderRadius: 1,
      transform: { rotate: '45deg' },
    },
  }

  static theme = ({ background, theme }) => {
    return {
      arrowInner: {
        background: background || theme.base.background,
      },
    }
  }
}
