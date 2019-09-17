import { Col, Grid, ListItem, SimpleText, SpaceGroup, TextProps, Theme, View } from '@o/ui'
import React, { memo } from 'react'

import earth from '../../public/images/earth.jpg'
import { FadeInView, FadeParent } from '../../views/FadeInView'
import { MediaSmallHidden } from '../../views/MediaView'
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

export default function MissionMottoSection() {
  return (
    <Theme name="home">
      <View height={70} />
      <AboutSection />

      <Page.BackgroundParallax
        speed={0.2}
        zIndex={-2}
        className="earth"
        backgroundImage={`url(${earth})`}
        backgroundSize="contain"
        backgroundPosition="center center"
        backgroundRepeat="no-repeat"
        x="6%"
        offset={-0.05}
      />
    </Theme>
  )
}

const Item = props => (
  <ListItem title={<SimpleText flex={1} size="sm" alpha={0.75} {...props} />} icon="tick" />
)

const dly = 120

export const AboutSection = memo(() => {
  return (
    <FadeParent>
      <SpacedPageContent
        padding={['15vh', '5%']}
        sm-padding={0}
        header={
          <>
            <FadeInView>
              <PillButton>About</PillButton>
            </FadeInView>
            <FadeInView delay={dly * 1}>
              <TitleText textAlign="center">A better deal for developers.</TitleText>
            </FadeInView>
          </>
        }
      >
        <View flex={1} />
        <Grid space="10%" itemMinWidth={340} height="70%">
          <Col space="lg">
            <FadeInView delay={dly * 2}>
              <TitleTextSub textAlign="left" alpha={1}>
                It's way too hard to build a decent application that gives you control, and lets you
                deploy where you want.
              </TitleTextSub>
            </FadeInView>

            <FadeInView delay={dly * 3}>
              <SubParagraph>
                Let's give developers more control and users a better experience out of the box.
              </SubParagraph>
            </FadeInView>

            <FadeInView delay={dly * 4}>
              <SubParagraph>
                It starts with apps that are easier to build and are built to last: open source, and
                cross-platform by default.
              </SubParagraph>
            </FadeInView>

            <FadeInView delay={dly * 5}>
              <SubParagraph>We're excited to share it with you.</SubParagraph>
            </FadeInView>
          </Col>

          <MediaSmallHidden>
            <Col space="md" justifyContent="flex-end">
              <FadeInView delay={dly * 5}>
                <TitleTextSub textAlign="left" alpha={1} size={1}>
                  Our goals
                </TitleTextSub>
              </FadeInView>

              <FadeInView delay={dly * 6}>
                <SpaceGroup space="md">
                  <Item>Build apps without infrastructure.</Item>

                  <Item>Deliver a truly native-feeling, multi-platform app experience.</Item>

                  <Item>Make DX a first-class citizen.</Item>

                  <Item>Give users control over their data.</Item>
                </SpaceGroup>
              </FadeInView>
            </Col>
          </MediaSmallHidden>
        </Grid>

        <View flex={1} minHeight={80} />
      </SpacedPageContent>
    </FadeParent>
  )
})
