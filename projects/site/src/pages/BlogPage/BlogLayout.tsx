import { Col, ColProps, Theme, View } from '@o/ui'
import React from 'react'
import { SectionContent } from '../../views/SectionContent'
import { TitleText } from '../../views/TitleText'
import { Wavy } from '../HomePage/EarlyAccessBetaSection'

export function BlogLayout({ children, ...props }: ColProps) {
  return (
    <>
      <Theme name="dark">
        <SectionContent padding={[0, 0, 20]}>
          <View pad>
            <Wavy position="absolute" top={0} left={0} right={0} bottom={0} />
            <TitleText textAlign="left" size="lg">
              The Orbit Blog
            </TitleText>
          </View>
        </SectionContent>
      </Theme>
      <SectionContent>
        <Col pad {...props}>
          {children}
        </Col>
      </SectionContent>
    </>
  )
}
