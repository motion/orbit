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
          max: 15,
          perspective: 500,
          scale: 1.05,
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
            if={false}
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
            width={width * 0.88}
            height={height * 0.88}
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
