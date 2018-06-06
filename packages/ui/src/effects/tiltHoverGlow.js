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
  version() {
    return 1
  }

  render({
    width,
    height,
    tiltOptions,
    children,
    restingPosition,
    hideShadow,
    hideGlow,
    shadowProps,
    glowProps,
    ...props
  }) {
    return (
      <Tilt
        options={{
          max: 15,
          perspective: 1000,
          scale: 1.025,
          speed: 200,
          reverse: true,
          ...tiltOptions,
        }}
        restingPosition={restingPosition}
      >
        <div
          $tiltglow
          css={{
            cursor: 'default',
            width,
            height,
            borderRadius: 0,
            overflow: 'hidden',
            transition: 'transform 50ms ease-in',
          }}
          {...props}
        >
          {children}
          <HoverGlow
            if={!hideGlow}
            full
            scale={0.5}
            resist={52}
            offsetTop={-80}
            blur={130}
            color="#fff"
            borderRadius={20}
            zIndex={100000}
            opacity={0.45}
            duration={30}
            restingPosition={restingPosition}
            {...glowProps}
          />
          <HoverGlow
            if={!hideShadow}
            behind
            color="#000"
            resist={96}
            scale={1}
            width={width}
            offsetTop={20}
            offsetLeft={2}
            full
            blur={25}
            inverse
            opacity={0.14}
            borderRadius={20}
            restingPosition={restingPosition}
            {...shadowProps}
          />
        </div>
      </Tilt>
    )
  }
}
