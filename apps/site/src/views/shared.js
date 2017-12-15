import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

export function Bubble({ fill = '#fff', ...props }) {
  return (
    <svg width="707px" height="670px" viewBox="0 0 707 670" {...props}>
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path
          d="M266.34375,12.5625 C123.785156,46.0859375 19.9960938,124.109375 3.8125,270.105469 C-12.3710938,416.101563 31.1757813,552.613281 156.355469,617.757813 C281.535156,682.902344 465.507813,696.976563 593.347656,596.589844 C721.1875,496.203125 739.125,305.960938 654.746094,157.644531 C570.367188,9.328125 408.902344,-20.9609375 266.34375,12.5625 Z"
          fill={fill}
        />
      </g>
    </svg>
  )
}

export function Ring({ fill = '#fff', ...props }) {
  return (
    <svg width="1050px" height="1040px" viewBox="0 0 1050 1040" {...props}>
      <path
        d="M810.71875,0 C910.099468,128.000518 1223.64844,489.015625 921.3125,863.859375 C618.976562,1238.70313 168.492187,917.976562 0.647418426,767.825238 C80.6531745,685.978949 191.851563,578.414063 247.09375,526.075865 C304.203125,584.75 521.210938,824.679688 675.148438,650.71875 C829.085938,476.757812 626.625888,302.63455 561.984375,241.570312 C695.188388,114.150175 787.873395,22.0617654 810.71875,0 Z"
        fill={fill}
      />
    </svg>
  )
}

export const Text = props => (
  <UI.Text selectable size={1.5} marginBottom={20} {...props} />
)

export const SubText = props => (
  <Text size={1.25} lineHeight="1.7rem" {...props} />
)

export const Hl = props => (
  <UI.Text
    display="inline"
    padding={[3]}
    background={'rgb(98.4%, 97.1%, 77.3%)'}
    {...props}
  />
)

export const Title = props => <Text fontWeight={800} {...props} />

export const SubTitle = props => (
  <UI.Title
    size={2.2}
    fontWeight={200}
    marginBottom={30}
    opacity={0.6}
    {...props}
  />
)

export const Hr = view('hr', {
  display: 'flex',
  height: 0,
  border: 'none',
  borderTop: [1, [0, 0, 0, 0.05]],
  paddingBottom: 20,
  marginTop: 20,
})

export const Link = view('a', {
  color: Constants.colorSecondary,
  fontWeight: 500,
  // textDecoration: 'underline',
})

export const Strong = view('strong', {
  fontWeight: 500,
})

export const List = view('ol', {
  '& > li': {
    listStylePosition: 'auto',
    listStyleType: 'decimal',
    margin: [0, 0, 15, 30],
  },
})
