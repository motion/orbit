// @flow
import React from 'react'
import { view } from '@jot/black'
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

  render({ width, height, tiltOptions, children }: Props) {
    return (
      <Tilt
        options={{
          max: 30,
          perspective: 1000,
          reverse: true,
          scale: 1,
          ...tiltOptions,
        }}
      >
        <doc
          $$style={{
            cursor: 'default',
            width,
            height,
            borderRadius: 5,
            transition: 'transform 50ms ease-in',
          }}
        >
          {children}
          <Glow
            full
            scale={2}
            resist={20}
            color={[255, 255, 255]}
            zIndex={1000}
            opacity={0.4}
            gradient
          />
          <Glow
            behind
            resist={90}
            width={width * 0.9}
            height={height * 0.9}
            blur={10}
            inverse
            color={[0, 0, 0]}
            zIndex={1000}
            opacity={0.3}
            borderRadius={10}
          />
        </doc>
      </Tilt>
    )
  }
}
