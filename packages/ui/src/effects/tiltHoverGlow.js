// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Tilt from 'react-tilt'
import HoverGlow from './hoverGlow'

type Props = {
  width: number,
  height: number,
  tiltOptions?: Object,
  children?: React$Element<any>,
  css?: Object,
}

@view.ui
export default class TiltHoverGlow extends React.PureComponent<Props> {
  static defaultProps: {}

  version() {
    return 1
  }

  render({ width, height, tiltOptions, children, css, ...props }: Props) {
    return (
      <Tilt
        options={{
          max: 15,
          perspective: 1000,
          scale: 1.025,
          speed: 400,
          //reverse: true,
          ...tiltOptions,
        }}
      >
        <tiltglow
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
            show
            scale={2}
            resist={20}
            color={[255, 255, 255]}
            overflow="hidden"
            borderRadius={8}
            zIndex={100000}
            opacity={1}
            transition={30}
          />
          <HoverGlow
            show
            behind
            resist={93}
            scale={1.1}
            width={width}
            offsetTop={2}
            offsetLeft={-12}
            blur={3}
            inverse
            color={[0, 0, 0]}
            opacity={0.08}
            borderRadius={5}
          />
        </tiltglow>
      </Tilt>
    )
  }
}
