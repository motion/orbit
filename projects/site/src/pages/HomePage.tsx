import { FullScreen, Row, Theme, useDebounce, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { Fragment, useState } from 'react'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import { Header } from '../components/Header'
import { FadeDown } from '../views/FadeDown'
import { Page } from '../views/Page'
import { Paragraph } from '../views/Paragraph'
import { TitleText } from '../views/TitleText'
import { ViewPortText } from '../views/ViewPortText'

export function HomePage() {
  let [measured, setMeasured] = useState(false)
  let setMeasuredDelayed = useDebounce(setMeasured, 1)
  let fontsLoaded = useWaitForFonts(['Eesti Pro'])
  let pSize = 16
  let [parSize, setParSize] = useState(pSize)

  if (!fontsLoaded) {
    return null
  }

  let texts = [
    `The decentralized internal app platform for teams who want to do more.`,
    `Workflows, database views, custom spreadsheets, dashboards, and more.`,
    `Runs behind your firewall, without a cloud.`,
  ]
  let longest = texts.reduce((a, c) => (a.length > c.length ? a : c), '')

  return (
    <Parallax pages={3}>
      <ParallaxLayer offset={0} speed={0.5}>
        <Theme name="dark">
          <FullScreen background={theme => theme.background}>
            <Page>
              <Header />

              <Row height="80%" margin="auto" alignItems="center">
                <View width="100%">
                  <FadeDown disable={!measured}>
                    <TitleText fontWeight={100}>
                      <ViewPortText onReady={() => !measured && setMeasuredDelayed(true)}>
                        Build internal tools without stress.
                      </ViewPortText>
                    </TitleText>

                    <ViewPortText style={{ opacity: 0 }} min={pSize} onReady={setParSize}>
                      {longest}
                    </ViewPortText>

                    <Paragraph
                      fontSize={parSize * 0.9}
                      sizeLineHeight={1.5}
                      textAlign="center"
                      alpha={0.7}
                    >
                      {texts.map((t, i) => (
                        <Fragment key={t}>
                          {i > 0 && <br />}
                          {t}
                        </Fragment>
                      ))}
                    </Paragraph>
                  </FadeDown>
                </View>
              </Row>
            </Page>
          </FullScreen>
        </Theme>
      </ParallaxLayer>
    </Parallax>
  )
}

HomePage.path = ''
HomePage.navigationOptions = {
  title: 'Home',
  linkName: 'Home Page',
}
