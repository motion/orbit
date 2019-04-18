import { Col, FullScreen, gloss, Grid, Space, TextProps, Theme, View } from '@o/ui'
import React from 'react'
import earth from '../../../public/images/earth.jpg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { SpacedPageContent } from './SpacedPageContent'

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

export function LegsSection(props) {
  return (
    <Theme name="home">
      <Page {...props}>
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
      </Page>
    </Theme>
  )
}

const Item = gloss(SubParagraph)

export function AboutSection() {
  const screen = useScreenSize()
  return (
    <SpacedPageContent
      padding={screen === 'small' ? 0 : [0, '10%']}
      header={
        <>
          <PillButton>About</PillButton>
          <Space size="sm" />
          <TitleText size="xl">A better deal for apps.</TitleText>
          <Space />
        </>
      }
    >
      <Grid space="10%" itemMinWidth={340} height="70%">
        <Col space="lg">
          <TitleTextSub textAlign="left" alpha={1} size={1}>
            Our app platforms are broken. They give us no control, and design apps to be silos that
            don't work together.
          </TitleTextSub>

          <SubParagraph>
            We think we can do better. It starts by enforcing a common way for apps to share data
            with each other, and building an open platform.
          </SubParagraph>
          <SubParagraph>
            Then, it requires a commitment to making apps easier to build, with less code and sharp
            edges. And performance must come by default.
          </SubParagraph>
          <SubParagraph>
            We're excited to share it with you.
          </SubParagraph>
        </Col>

        {screen !== 'small' && (
          <Col space="md" justifyContent="flex-end">
            <TitleTextSub textAlign="left" alpha={1} size={1}>
              Our goals
            </TitleTextSub>

            <Item>Build apps without infrastructure.</Item>

            <Item>Enable an ecosystem of apps, views and data.</Item>

            <Item>A truly native-feeling multi-platform app experience.</Item>

            <Item>Make DX a first-class citizen.</Item>

            <Item>Give users control over their data.</Item>
          </Col>
        )}
      </Grid>

      <View minHeight={80} />
    </SpacedPageContent>
  )
}
