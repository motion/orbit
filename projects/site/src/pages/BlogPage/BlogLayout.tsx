import { Col, ColProps, Space, Theme } from '@o/ui'
import React from 'react'

import { SectionContent } from '../../views/SectionContent'
import { BlogTitle } from '../BlogPage'
import { AboveFooter, Footer } from '../HomePage/FooterSection'

export function BlogLayout({ children, ...props }: ColProps) {
  return (
    <>
      <BlogTitle />
      <SectionContent>
        <Col pad {...props}>
          {children}
        </Col>
      </SectionContent>

      <BlogFooter />
    </>
  )
}

export function BlogFooter() {
  return (
    <>
      <Space size="xxl" />
      <Space size="xxl" />
      <Space size="xxl" />

      <Col height={450} pad={[true, 0]}>
        <AboveFooter />
      </Col>

      <Space size="xxl" />

      <Theme name="dark">
        <SectionContent background="#111" padding={[50, 0]}>
          <Footer />
        </SectionContent>
      </Theme>
    </>
  )
}
