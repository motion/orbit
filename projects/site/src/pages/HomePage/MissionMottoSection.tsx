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
    size={1.2}
    sizeLineHeight={1.25}
    fontWeight={200}
    alpha={0.6}
    {...props}
  />
)

export function LegsSection(props) {
  const screen = useScreenSize()
  return (
    <Theme name="home">
      <Page {...props}>
        <Page.Content>
          <View height={70} />
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
                  Our app platforms are broken. We want apps that are easy to build, powerful, user
                  friendly, portable and collaborative.
                </TitleTextSub>

                <SubParagraph>
                  Lorem ipsum dolor sit amet. An intro into how were thinking about the mission.
                </SubParagraph>
                <SubParagraph>
                  We've spent many years putting together a large collection of performant views.
                  They are fine tuned to feel great. We've built large apps with it.
                </SubParagraph>
                <SubParagraph>
                  Now, we're releasing it as a platform for the world to leverage. Our goal is to
                  lower the bar dramatically to building incredibly powerful apps of all types.
                </SubParagraph>
                <SubParagraph>We'd like to build it with you.</SubParagraph>
              </Col>

              {screen === 'large' && (
                <Col space="md" justifyContent="flex-end">
                  <TitleTextSub textAlign="left" alpha={1} size={1}>
                    Our goals
                  </TitleTextSub>

                  <Item>Build apps without infrastructure.</Item>

                  <Item>Enable an ecosystem of views and data providers.</Item>

                  <Item>Go cross platform easily.</Item>

                  <Item>Better accessiblity through native-like views.</Item>

                  <Item>Make DX a first-class citizen.</Item>
                </Col>
              )}
            </Grid>

            <View minHeight={80} />
          </SpacedPageContent>
        </Page.Content>

        <Page.Parallax speed={0.1} zIndex={-1}>
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
