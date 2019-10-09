import { linearGradient, Stack, useTheme } from '@o/ui'
import React from 'react'
import { Link } from 'react-navi'

import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'

export const BlogTitle = (props: any) => {
  const theme = useTheme()
  return (
    <Stack
      position="relative"
      background={linearGradient(theme.background, theme.background.lighten(0.2))}
    >
      <SectionContent zIndex={2}>
        <Link href="/blog" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <Stack
            textAlign="center"
            padding={[40, 20, 20]}
            position="relative"
            cursor="pointer"
            {...props}
          >
            <TitleText cursor="pointer" size="xxxs" fontWeight={200} textTransform="uppercase">
              The Orbit Blog
            </TitleText>
          </Stack>
        </Link>
      </SectionContent>
    </Stack>
  )
}
