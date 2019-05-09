import { Col, FullScreen, gloss, Grid, Space, SpaceGroup, TextProps, Theme, View } from '@o/ui'
import React from 'react'

import earth from '../../../public/images/earth.jpg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeChild, FadeParent } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export const SubParagraph = (props: TextProps) => (
  <Paragraph
    textAlign="left"
    size={1.35}
    sizeLineHeight={1.25}
    fontWeight={300}
    alpha={0.6}
    {...props}
  />
)

export default function LegsSection() {
  return (
    <Theme name="home">
      <Page.Content>
        <View height={70} />
        <AboutSection />
      </Page.Content>

      <Page.Parallax speed={0.075} zIndex={-1}>
        <FullScreen
          className="earth"
          backgroundImage={`url(${earth})`}
          backgroundSize="contain"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
          transform={{
            scale: 1,
            x: '6%',
            y: '-5%',
          }}
        />
      </Page.Parallax>
    </Theme>
  )
}

const Item = gloss(SubParagraph)

const dly = 120

export function AboutSection() {
  const screen = useScreenSize()
  return (
    <FadeParent>
      <SpacedPageContent
        padding={screen === 'small' ? 0 : [0, '10%']}
        header={
          <>
            <FadeChild>
              <PillButton>About</PillButton>
            </FadeChild>
            <Space size="sm" />
            <FadeChild delay={dly * 1}>
              <TitleText textAlign="center" size="xl">
                A better deal for apps.
              </TitleText>
            </FadeChild>
          </>
        }
      >
        <Grid space="10%" itemMinWidth={340} height="70%">
          <Col space="lg">
            <FadeChild delay={dly * 2}>
              <TitleTextSub textAlign="left" alpha={1}>
                It's too hard to build apps.
              </TitleTextSub>
            </FadeChild>

            <FadeChild delay={dly * 3}>
              <SubParagraph>
                We think we can do better - give developers control, and users an incredible user
                experience by default.
              </SubParagraph>
            </FadeChild>

            <FadeChild delay={dly * 4}>
              <SubParagraph>
                It starts by making apps to share data with each other, and creating an open
                platform. And a commitment to making apps easier to realize our ideas on a
                sustainable platform.
              </SubParagraph>
            </FadeChild>

            <FadeChild delay={dly * 5}>
              <SubParagraph>We're excited to share it with you.</SubParagraph>
            </FadeChild>
          </Col>

          {screen !== 'small' && (
            <Col space="md" justifyContent="flex-end">
              <FadeChild delay={dly * 5}>
                <TitleTextSub textAlign="left" alpha={1} size={1}>
                  Our goals
                </TitleTextSub>
              </FadeChild>

              <FadeChild delay={dly * 6}>
                <SpaceGroup space="md">
                  <Item>Build apps without infrastructure.</Item>

                  <Item>Deliver a truly native-feeling, multi-platform app experience.</Item>

                  <Item>Make DX a first-class citizen.</Item>

                  <Item>Give users control over their data.</Item>
                </SpaceGroup>
              </FadeChild>
            </Col>
          )}
        </Grid>

        <View minHeight={80} />
      </SpacedPageContent>
    </FadeParent>
  )
}
