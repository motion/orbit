import { useTheme } from 'gloss'
import React, { HTMLAttributes, memo } from 'react'

import { useDefaultProps } from './hooks/useDefaultProps'

// https://github.com/chantastic/react-svg-spinner

export type SpinnerProps = HTMLAttributes<SVGElement> & {
  color?: any
  thickness?: number
  gap?: number
  speed?: 'fast' | 'slow'
  size?: string
}

export const Spinner = memo((directProps: SpinnerProps) => {
  const theme = useTheme()
  const { color, gap, thickness, size, speed, ...rest } = useDefaultProps(
    {
      color: theme.color,
      gap: 4,
      thickness: 4,
      size: '1em',
      speed: 'slow',
    },
    directProps,
  )
  return (
    <svg
      height={size}
      width={size}
      {...rest}
      style={{ animationDuration: `${speedSwitch(speed)}ms` }}
      className="__react-svg-spinner_circle"
      role="img"
      aria-labelledby="title desc"
      viewBox="0 0 32 32"
    >
      <title id="title">Circle loading spinner</title>
      <desc id="desc">Image of a partial circle indicating "loading."</desc>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .__react-svg-spinner_circle{
            transition-property: transform;
            animation-name: __react-svg-spinner_infinite-spin;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
        @keyframes __react-svg-spinner_infinite-spin {
            from {transform: rotate(0deg)}
            to {transform: rotate(360deg)}
        }
      `,
        }}
      />
      <circle
        role="presentation"
        cx={16}
        cy={16}
        r={14 - thickness / 2}
        stroke={`${color}`}
        fill="none"
        strokeWidth={thickness}
        strokeDasharray={Math.PI * 2 * (11 - gap)}
        strokeLinecap="round"
      />
    </svg>
  )
})

function speedSwitch(speed) {
  if (speed === 'fast') return 600
  if (speed === 'slow') return 900
  return 750
}

// attempt to reduce gpu usage but something else is going on
// while this spinner is based on: https://projects.lukehaas.me/css-loaders/
// which runs at 5% cpu usage on my computer
// running the same thing in orbit is 65% cpu usage, so must be due to nesting, inline css, something else....

// import { Base, Box, gloss, useTheme } from 'gloss'
// import React, { memo } from 'react'

// export type SpinnerProps = {
//   size?: number
//   color?: any
// }

// export const Spinner = memo(({ color, size }: SpinnerProps) => {
//   const theme = useTheme()
//   return (
//     <Box
//       style={{
//         transform: `scale(${size})`,
//         width: size,
//         height: size,
//       }}
//     >
//       <Loader>
//         <Spin1 background={color || theme.color} />
//         <Spin2 background={color || theme.color} />
//         <style
//           dangerouslySetInnerHTML={{
//             __html: `
//             @-webkit-keyframes load2 {
//               0% {
//                 -webkit-transform: rotate(0deg);
//                 transform: rotate(0deg);
//               }
//               100% {
//                 -webkit-transform: rotate(360deg);
//                 transform: rotate(360deg);
//               }
//             }
//             @keyframes load2 {
//               0% {
//                 -webkit-transform: rotate(0deg);
//                 transform: rotate(0deg);
//               }
//               100% {
//                 -webkit-transform: rotate(360deg);
//                 transform: rotate(360deg);
//               }
//             }
//         `,
//           }}
//         />
//       </Loader>
//     </Box>
//   )
// })

// const Loader = gloss(Box, {
//   color: '#ffffff',
//   position: 'relative',
//   width: 10,
//   height: 10,
//   boxShadow: 'inset 0 0 0 1px',
//   transform: 'translateZ(0)',
//   borderRadius: '50%',
// })

// const Spin1 = gloss(Base, {
//   position: 'absolute',
//   width: 5.2,
//   height: 10.2,
//   borderRadius: '10.2em 0 0 10.2px',
//   top: -0.1,
//   left: -0.1,
//   WebkitTransformOrigin: '5.1em 5.1px',
//   transformOrigin: '5.1em 5.1px',
//   WebkitAnimation: 'load2 2s infinite ease 1.5s',
//   animation: 'load2 2s infinite ease 1.5s',
// })

// const Spin2 = gloss(Base, {
//   position: 'absolute',
//   width: 5.2,
//   height: 10.2,
//   borderRadius: '0 10.2em 10.2em 0',
//   top: -0.1,
//   left: 4.9,
//   WebkitTransformOrigin: '0.1em 5.1px',
//   transformOrigin: '0.1em 5.1px',
//   WebkitAnimation: 'load2 2s infinite ease',
//   animation: 'load2 2s infinite ease',
// })
