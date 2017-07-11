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

  render({ width, height, tiltOptions, children }: Props) {
    return (
      <Tilt
        options={{
          max: 10,
          perspective: 500,
          scale: 1,
          reverse: true,
          ...tiltOptions,
        }}
      >
        <doc
          $$style={{
            cursor: 'default',
            width,
            height,
            borderRadius: 5,
            overflow: 'hidden',
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
            resist={93}
            width={width * 0.85}
            height={height * 0.85}
            blur={10}
            inverse
            color={[0, 0, 0]}
            zIndex={1000}
            opacity={0.05}
            borderRadius={10}
          />
        </doc>
      </Tilt>
    )
  }
}
