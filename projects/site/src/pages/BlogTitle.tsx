import { Absolute, Col } from '@o/ui'
import React from 'react'
import { Link } from 'react-navi'

import { colors } from '../colors'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'

export const BlogTitle = (props: any) => (
  <Col position="relative" background={theme => theme.background}>
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
    <Absolute bottom={0} left={0} right={0} top={0} zIndex={0} background={colors.purple} />
  </Col>
)
