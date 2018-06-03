import * as React from 'react'
import { view } from '@mcro/black'
import { Tilt } from './tilt'
import { HoverGlow } from './hoverGlow'

// type Props = {
//   width: number,
//   height: number,
//   tiltOptions?: Object,
//   children?: React$Element<any>,
//   css?: Object,
// }

@view.ui
export class TiltHoverGlow extends React.PureComponent {
  static defaultProps = {
    tiltOptions: {
      max: 15,
      perspective: 1000,
      scale: 1.025,
      speed: 400,
      reverse: true,
    },
  }

  version() {
    return 1
  }

  render({
    width,
    height,
    tiltOptions,
    children,
    restingMousePosition,
    css,
    ...props
  }) {
    return (
      <Tilt options={tiltOptions}>
        <div
          $tiltglow
          css={{
            cursor: 'default',
            width,
            height,
            borderRadius: 0,
            overflow: 'hidden',
            transition: 'transform 50ms ease-in',
            ...css,
          }}
          {...props}
        >
          {children}
          <HoverGlow
            full
            scale={0.5}
            resist={52}
            offsetTop={-80}
            blur={130}
            color="#fff"
            borderRadius={20}
            zIndex={100000}
            opacity={0.35}
            duration={30}
            restingMousePosition={restingMousePosition}
            overflow="hidden"
          />
          <HoverGlow
            behind
            color="#000"
            resist={96}
            scale={0.95}
            width={width}
            offsetTop={0}
            offsetLeft={10}
            full
            blur={25}
            inverse
            opacity={0.14}
            borderRadius={20}
            restingMousePosition={restingMousePosition}
          />
        </div>
      </Tilt>
    )
  }
}
