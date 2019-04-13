import { Col, FullScreen, gloss, Grid, Paragraph, SimpleText, Space, TextProps, Theme } from '@o/ui'
import React from 'react'
import earth from '../../../public/images/earth.jpg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SpacedPageContent } from './SpacedPageContent'

export const SubParagraph = (props: TextProps) => (
  <TitleText size={1.4} sizeLineHeight={1.1} fontWeight={200} alpha={0.5} {...props} />
)

export function LegsSection() {
  return (
    <Theme name="home">
      <Page offset={6}>
        <Page.Content>
          <SpacedPageContent
            header={
              <>
                <PillButton>About</PillButton>
                <Space size="sm" />
                <TitleText size="xl">A better deal for apps.</TitleText>
              </>
            }
          >
            <Grid space itemMinWidth={400}>
              <Col space="lg">
                <TitleTextSub alpha={1} size={2.6}>
                  The web and app platforms are broken. Lets make apps easy to build, user friendly,
                  portable and collaborative.
                </TitleTextSub>

                <SubParagraph>
                  Lorem ipsum dolor firsthand, we've felt the pains sit amet. Our theory is simple:
                  apps like VSCode prove that with a carefully designed view library and APIs, it's
                  more than possible to run nicely. WebAssembly is exciting, leaving room to do
                  mixed rendering for an incredible future.
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

              <Col space="lg">
                <Paragraph>Our goals</Paragraph>

                <Item>Let you build apps with other people without infrastructure.</Item>

                <Item>
                  Standardize apps that provide access to their data, for rich collaboration.
                </Item>

                <Item>Let your apps to go cross platform easily.</Item>

                <Item>Have better accessiblity, keyboard navigation, and native feel.</Item>

                <Item>
                  Avoid performance cliffs of the DOM, by providing powerful views, primitives, and
                  dev tools.
                </Item>
              </Col>
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Parallax speed={0.1} zIndex={-2}>
          <FullScreen
            className="earth"
            backgroundImage={`url(${earth})`}
            backgroundSize="cover"
            backgroundPosition="center center"
            backgroundRepeat="no-repeat"
            transform={{
              scale: 0.5,
            }}
          />
        </Page.Parallax>
      </Page>
    </Theme>
  )
}

const Item = gloss(SimpleText)
