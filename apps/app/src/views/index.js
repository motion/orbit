import * as React from 'react'
import * as UI from '@mcro/ui'

export * from './roundButton'

export const Circle = props => (
  <circle
    css={{
      display: 'inline-block',
      borderRadius: 100,
      width: 18,
      height: 18,
      lineHeight: '18px',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      background: '#696549',
      color: '#fff',
      fontWeight: 600,
      fontSize: 12,
      margin: [-2, 6, -2, -2],
    }}
    {...props}
  />
)

export const Title = ({ center, children, ...props }) => (
  <UI.Title
    size={1.4}
    fontWeight={300}
    css={{
      padding: [0, 15, 2],
      alignSelf: 'center',
      alignItems: center ? 'center' : 'flex-start',
    }}
    {...props}
  >
    {children}
  </UI.Title>
)

export const SubTitle = props => (
  <subtitle
    css={{
      fontWeight: 400,
      fontSize: 13,
      alignItems: 'center',
      flexFlow: 'row',
      padding: [5, 15],
      textTransform: 'uppercase',
      opacity: 0.5,
      marginBottom: 5,
    }}
    {...props}
  />
)

export const Link = props => (
  <UI.Text fontWeight={400} color="#8b2bec" display="inline" {...props} />
)
