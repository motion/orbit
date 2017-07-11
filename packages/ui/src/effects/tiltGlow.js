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

  render({ width, height, tiltOptions, children }: Props) {
    console.log('render me just to check22')
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
            show
            scale={1}
            resist={20}
            color="red"
            zIndex={100000}
            opacity={1}
            gradient
          />
          <Glow
            behind
            resist={93}
            width={width * 0.95}
            height={height * 0.95}
            scale={1}
            offsetTop={5}
            offsetLeft={-10}
            blur={5}
            inverse
            color={[0, 0, 0]}
            opacity={0.15}
            borderRadius={5}
          />
        </doc>
      </Tilt>
    )
  }
}
