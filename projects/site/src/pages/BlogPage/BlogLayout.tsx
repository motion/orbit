import { Col, ColProps, Space } from '@o/ui'
import React from 'react'

import { SectionContent } from '../../views/SectionContent'
import { AboveFooter } from '../HomePage/AboveFooter'
import { Footer } from '../HomePage/Footer'

export function BlogLayout({ children, ...props }: ColProps) {
  return (
    <>
      <Space size="xxxl" />
      <SectionContent minHeight={500}>
        <Col {...props}>{children}</Col>
      </SectionContent>
      <BlogFooter />
    </>
  )
}

export function BlogFooter() {
  return (
    <>
      <Space size="xxl" />
      <Col padding={[true, 0]}>
        <AboveFooter />
      </Col>
      <Space size="xxl" />
      <SectionContent>
        <Footer />
      </SectionContent>
    </>
  )
}
