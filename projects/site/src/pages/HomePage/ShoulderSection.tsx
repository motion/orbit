import { Col, FullScreen, gloss, Paragraph, Row, Space } from '@o/ui'
import React from 'react'
import orbitsbg from '../../../public/images/orbits-bg.jpg'
import orbits from '../../../public/images/orbits.svg'
import { Page } from '../../views/Page'
import { ParagraphIntro } from '../../views/ParagraphIntro'
import { PillButton } from '../../views/PillButton'
import { Spotlight } from '../../views/Spotlight'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'

export function ShoulderSection() {
  return (
    <Page offset={2}>
      <Page.Content>
        <SpacedPageContent
          header={
            <>
              <PillButton>Deploy</PillButton>
              <Space size="sm" />
              <TitleText size="xl">The worlds fastest idea-to-deploy.</TitleText>
            </>
          }
        >
          <Row space="lg" margin={[0, '-20%']}>
            <Col flex={2}>image</Col>
            <Col flex={1} space>
              <ParagraphIntro>
                Orbit vertically integrates from the UI kit to deploy. It lets us handle everything
                you don't want to.
              </ParagraphIntro>

              <Paragraph>
                You need to build simple but dynamic apps to help your team move fast. You don't
                want to spend time taping together a modern app platform yourself. Let alone
                maintaining it over time.
              </Paragraph>

              <Paragraph>
                Orbit gives you everything you need to build amazing apps, on an entirely open
                source platform designed for security from the start. Plus, you can eject if you
                ever need it.
              </Paragraph>

              <Paragraph>It's the level of control we need. Learn more.</Paragraph>
            </Col>
            <Col flex={2}>image</Col>
          </Row>
        </SpacedPageContent>
      </Page.Content>

      <Page.Background background={theme => theme.background} />

      <Page.Parallax overflow="hidden" speed={0.1} zIndex={-2}>
        <FullScreen
          className="orbits-bg"
          opacity={0.12}
          backgroundImage={`url(${orbitsbg})`}
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
        />
        <Spotlight />
      </Page.Parallax>

      <Page.Parallax overflow="hidden" speed={0.2} zIndex={-2}>
        <FullScreen
          top="auto"
          height="50%"
          className="orbits"
          backgroundImage={`url(${orbits})`}
          backgroundPosition="top center"
          backgroundRepeat="no-repeat"
        />
        <FadeDown top="auto" height="50%" />
      </Page.Parallax>
    </Page>
  )
}

const FadeDown = gloss(FullScreen).theme((_, theme) => ({
  background: `linear-gradient(transparent, ${theme.background} 80%)`,
}))
