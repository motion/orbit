import { Base, Box, gloss, useTheme } from 'gloss'
import React, { memo } from 'react'

export type SpinnerProps = {
  size?: number
  color?: any
}

export const Spinner = memo(({ color, size }: SpinnerProps) => {
  const theme = useTheme()
  return (
    <Box
      style={{
        transform: `scale(${size})`,
        width: size,
        height: size,
      }}
    >
      <Loader>
        <Spin1 background={color || theme.color} />
        <Spin2 background={color || theme.color} />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @-webkit-keyframes load2 {
              0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
              }
              100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
              }
            }
            @keyframes load2 {
              0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
              }
              100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
              }
            }
        `,
          }}
        />
      </Loader>
    </Box>
  )
})

const Loader = gloss(Box, {
  color: '#ffffff',
  fontSize: '11px',
  textIndent: '-99999em',
  margin: '55px auto',
  position: 'relative',
  width: '10em',
  height: '10em',
  boxShadow: 'inset 0 0 0 1em',
  WebkitTransform: 'translateZ(0)',
  MsTransform: 'translateZ(0)',
  transform: 'translateZ(0)',
  borderRadius: '50%',
})

const Spin1 = gloss(Base, {
  position: 'absolute',
  width: '5.2em',
  height: '10.2em',
  borderRadius: '10.2em 0 0 10.2em',
  top: '-0.1em',
  left: '-0.1em',
  WebkitTransformOrigin: '5.1em 5.1em',
  transformOrigin: '5.1em 5.1em',
  WebkitAnimation: 'load2 2s infinite ease 1.5s',
  animation: 'load2 2s infinite ease 1.5s',
})

const Spin2 = gloss(Base, {
  position: 'absolute',
  width: '5.2em',
  height: '10.2em',
  borderRadius: '0 10.2em 10.2em 0',
  top: '-0.1em',
  left: '4.9em',
  WebkitTransformOrigin: '0.1em 5.1em',
  transformOrigin: '0.1em 5.1em',
  WebkitAnimation: 'load2 2s infinite ease',
  animation: 'load2 2s infinite ease',
})
