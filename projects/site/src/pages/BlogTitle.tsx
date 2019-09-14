import { Absolute, Col } from '@o/ui'
import React from 'react'
import { Link } from 'react-navi'

import { FadeInView } from '../views/FadeInView'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { Wavy } from './HomePage/purpleWaveUrl'

export const BlogTitle = (props: any) => (
  <Col position="relative">
    <SectionContent>
      <Link href="/blog" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <Col padding={[100, 30, 30]} position="relative" cursor="pointer" {...props}>
          <FadeInView>
            <TitleText
              cursor="pointer"
              textAlign="center"
              size="sm"
              fontWeight={200}
              alpha={0.5}
              hoverStyle={{ alpha: 1 }}
            >
              The Orbit Blog
            </TitleText>
          </FadeInView>
        </Col>
      </Link>

      <FadeInView delay={300}>
        <Absolute bottom={0} left={0} right={0} height={2}>
          <Wavy position="absolute" top={0} left={0} right={0} bottom={0} />
        </Absolute>
      </FadeInView>
    </SectionContent>
  </Col>
)
