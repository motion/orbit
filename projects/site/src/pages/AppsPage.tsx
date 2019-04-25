import { Col, FullScreen, Grid, Space, Theme, View } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import earth from '../../public/images/earth.jpg'
import { bodyElement } from '../constants'
import { useScreenSize } from '../hooks/useScreenSize'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { Page } from '../views/Page'
import { Parallax } from '../views/Parallax'
import { TitleText } from '../views/TitleText'
import { TitleTextSub } from './HomePage/AllInOnePitchDemoSection'
import { FeetSection } from './HomePage/FooterSection'
import { SubParagraph } from './HomePage/MissionMottoSection'
import { SpacedPageContent } from './HomePage/SpacedPageContent'

export default mount({
  '/': route({
    title: 'Apps',
    view: <AppsPage />,
  }),
})

export function AppsPage() {
  const siteStore = useSiteStore()

  return (
    <>
      <Header slim />
      <Parallax
        pages={2}
        scrollingElement={window}
        container={bodyElement}
        pageHeight={siteStore.sectionHeight}
      >
        <ComingSoonSection offset={0} />
        <FeetSection offset={1} />
      </Parallax>
    </>
  )
}

export function ComingSoonSection(props) {
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
                <TitleText size="xl">Coming Soon</TitleText>
                <Space />
              </>
            }
          >
            <Grid space="10%" itemMinWidth={340} height="70%">
              <Col space="lg">
                <TitleTextSub textAlign="left" alpha={1} size={1}>
                  We're currently building out the App building documentation.
                </TitleTextSub>

                <SubParagraph>Please bear with us as we get this thing going.</SubParagraph>
              </Col>
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

AppsPage.theme = 'home'
