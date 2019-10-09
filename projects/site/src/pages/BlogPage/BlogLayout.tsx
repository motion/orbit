import { Space, Stack, StackProps, Theme } from '@o/ui'
import React from 'react'

import { SectionContent } from '../../views/SectionContent'
import { AboveFooter } from '../HomePage/AboveFooter'
import { Footer } from '../HomePage/Footer'

export function BlogLayout({ children, ...props }: StackProps) {
  return (
    <Theme name="brown">
      <Space size="xxxl" />
      <SectionContent minHeight={500}>
        <Stack {...props}>{children}</Stack>
      </SectionContent>
      <BlogFooter />
    </Theme>
  )
}

export function BlogFooter() {
  return (
    <>
      <Space size="xxl" />
      <Stack padding={[true, 0]}>
        <AboveFooter />
      </Stack>
      <Space size="xxl" />
      <SectionContent>
        <Footer />
      </SectionContent>
    </>
  )
}
