import * as React from 'react'
import { view } from '@mcro/black'
import Tilt from 'react-tilt'
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

  render({ width, height, tiltOptions, children, css, ...props }) {
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
            resist={72}
            blur={130}
            color="#fff"
            borderRadius={20}
            zIndex={100000}
            opacity={0.4}
            duration={30}
          />
          <HoverGlow
            behind
            color="#000"
            resist={93}
            scale={0.95}
            width={width}
            offsetTop={80}
            offsetLeft={-15}
            full
            blur={20}
            inverse
            opacity={0.04}
            borderRadius={20}
          />
        </div>
      </Tilt>
    )
  }
}
