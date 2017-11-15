import * as React from 'react'
import * as View from '~/views'

export default ({ color = '#fff' }) => (
  <logos
    css={{
      alignItems: 'center',
      flexFlow: 'row',
      padding: 10,
    }}
  >
    <View.Icon
      fill={color}
      css={{
        height: 45,
        margin: [-10, 10, -10, -5],
      }}
    />
    <View.Logo css={{ height: 24 }} fill={color} />
  </logos>
)
