// @flow
import { view } from '@mcro/black'
import React from 'react'
import Tilt from 'react-tilt'
import Glow from './glow'

type Props = {
  width: number,
  height: number,
  tiltOptions?: Object,
  children?: React$Children,
}

@view
export default class TiltGlow {
  props: Props

  version() {
    return 1
  }

  render({ width, height, tiltOptions, children, css, ...props }: Props) {
    return (
      <Tilt
        options={{
          max: 10,
          perspective: 500,
          scale: 1.01,
          reverse: true,
          ...tiltOptions,
        }}
      >
        <tiltglow
          css={{
            cursor: 'default',
            width,
            height,
            borderRadius: 5,
            overflow: 'hidden',
            transition: 'transform 50ms ease-in',
            background: '#fff',
            ...css,
          }}
          {...props}
        >
          {children}
          <Glow
            full
            show
            scale={2}
            resist={20}
            color={[255, 255, 255]}
            overflow="hidden"
            borderRadius={8}
            zIndex={100000}
            opacity={0.4}
            transition={30}
            gradient
          />
          <Glow
            show
            behind
            resist={93}
            width={width * 1}
            height={height * 1}
            offsetTop={5}
            offsetLeft={-15}
            blur={5}
            inverse
            color={[0, 0, 0]}
            opacity={0.15}
            borderRadius={5}
          />
        </tiltglow>
      </Tilt>
    )
  }
}
