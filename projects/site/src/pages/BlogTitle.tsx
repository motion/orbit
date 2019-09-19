import { Absolute, Col } from '@o/ui'
import React from 'react'
import { Link } from 'react-navi'

import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { Wavy } from './HomePage/purpleWaveUrl'

export const BlogTitle = (props: any) => (
  <Col position="relative">
    <SectionContent>
      <Link href="/blog" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <Col padding={[40, 20, 20]} position="relative" cursor="pointer" {...props}>
          <TitleText cursor="pointer" size="xxs" fontWeight={600} alpha={0.5}>
            Blog
          </TitleText>
        </Col>
      </Link>

      <Absolute bottom={0} left={0} right={0} height={2}>
        <Wavy position="absolute" top={0} left={0} right={0} bottom={0} />
      </Absolute>
    </SectionContent>
  </Col>
)
