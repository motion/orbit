import { Box, BoxProps, gloss } from 'gloss'
import React from 'react'

import { useScreenVal } from '../pages/HomePage/SpacedPageContent'
import { SectionContent } from './SectionContent'

export function HeaderContain(props) {
  return (
    <SectionContent
      padding={[0, useScreenVal('0%', '1%', '10%')]}
      flexFlow="row"
      alignItems="center"
      justifyContent="space-around"
      {...props}
    />
  )
}
export const LinkSection = gloss<BoxProps & { alignRight?: boolean }>(Box, {
  flex: 4,
  flexFlow: 'row',
  justifyContent: 'space-between',
  maxWidth: 380,
  alignItems: 'center',
  padding: [0, '3%', 0, '1%'],
  alignRight: {
    padding: [0, '1%', 0, '3%'],
  },
})
