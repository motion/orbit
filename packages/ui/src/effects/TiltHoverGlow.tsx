import * as React from 'react'
import { view } from '@mcro/black'
import { Tilt } from './tilt'
import { HoverGlow, HoverGlowProps } from './HoverGlow'

type TiltHoverGlowProps = {
  width: number
  height: number
  tiltOptions?: Object
  children?: React.ReactNode
  css?: Object
  glowProps?: HoverGlowProps
  restingPosition?: [number, number]
  hideShadow?: boolean
  hideGlow?: boolean
  shadowProps?: Object
}

@view.ui
export class TiltHoverGlow extends React.PureComponent<TiltHoverGlowProps> {
  version() {
    return 1
  }

  render() {
    const {
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
    } = this.props
    return (
      <Tilt
        options={{
          max: 20,
          perspective: 2000,
          scale: 1,
          speed: 200,
          reverse: true,
          ...tiltOptions,
        }}
        restingPosition={restingPosition}
      >
        <div
          style={{
            cursor: 'default',
            width,
            height,
            overflow: 'hidden',
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
            blur={80}
            color="#fff"
            borderRadius={20}
            zIndex={100000}
            opacity={0.45}
            duration={30}
            restingPosition={restingPosition}
            overflow="hidden"
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
            opacity={0.24}
            borderRadius={20}
            restingPosition={restingPosition}
            {...shadowProps}
          />
        </div>
      </Tilt>
    )
  }
}
