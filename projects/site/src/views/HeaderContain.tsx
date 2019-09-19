import { View } from '@o/ui'
import { BoxProps, gloss } from 'gloss'
import React from 'react'

import { SectionContent } from './SectionContent'

export function HeaderContain(props) {
  return (
    <SectionContent
      padding={[0, '1%']}
      sm-padding={[0, '0%']}
      lg-padding={[0, '2%']}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-around"
      {...props}
    />
  )
}

export const LinkSection = gloss<BoxProps & { alignRight?: boolean }>(View, {
  flex: 4,
  flexDirection: 'row',
  justifyContent: 'space-between',
  maxWidth: 380,
  alignItems: 'center',
  padding: [0, '3%', 0, '1%'],
  alignRight: {
    padding: [0, '1%', 0, '3%'],
  },
})
