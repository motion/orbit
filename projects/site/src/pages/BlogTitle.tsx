import { Stack } from '@o/ui'
import React from 'react'
import { Link } from 'react-navi'

import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'

export const BlogTitle = (props: any) => {
  return (
    <Stack position="relative" background={theme => theme.background}>
      <SectionContent zIndex={2}>
        <Link href="/blog" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <Stack
            textAlign="center"
            padding={[40, 20, 20]}
            position="relative"
            cursor="pointer"
            {...props}
          >
            <TitleText size="md" cursor="pointer" fontWeight={100}>
              The Blog
            </TitleText>
          </Stack>
        </Link>
      </SectionContent>
    </Stack>
  )
}
