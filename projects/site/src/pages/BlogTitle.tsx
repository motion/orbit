import { Col, linearGradient } from '@o/ui'
import React from 'react'
import { Link } from 'react-navi'

import { colors } from '../colors'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'

export const BlogTitle = (props: any) => (
  <Col
    position="relative"
    background={linearGradient(colors.purple, colors.purple.mix('#2F30C9', 0.18))}
  >
    <SectionContent zIndex={2}>
      <Link href="/blog" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <Col
          textAlign="center"
          padding={[40, 20, 20]}
          position="relative"
          cursor="pointer"
          {...props}
        >
          <TitleText cursor="pointer" size="xs" fontWeight={600}>
            The Orbit Blog
          </TitleText>
        </Col>
      </Link>
    </SectionContent>
  </Col>
)
