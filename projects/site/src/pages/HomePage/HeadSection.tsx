import { Center, FullScreen, Image, Row, useDebounce, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { useState } from 'react'
import download from '../../../public/images/download.svg'
import glow from '../../../public/images/glow.svg'
import lineSep from '../../../public/images/line-sep.svg'
import macbook from '../../../public/images/macbook.png'
import screen from '../../../public/images/screen.jpg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeDown } from '../../views/FadeDown'
import { Header } from '../../views/Header'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { Text } from '../../views/Text'
import { TitleText } from '../../views/TitleText'
import { TopBlur } from '../../views/TopBlur'
import { ViewPortText } from '../../views/ViewPortText'

let allTitles = {
  large: 'A new way to build apps together.',
  medium: 'A new way to build apps together.',
  small: 'Build apps together.',
}

let allTexts = {
  large: [
    `Make powerful apps in minutes with no configuration, deploy them without a server.`,
    `It's internal tools made easy. Workflows, spreadsheets, dashboards and more.`,
    `Runs behind the firewall, without a cloud.`,
  ],
  medium: [
    `Make powerful, beautiful apps in minutes, no configuration & no servers.`,
    `Make internal workflows, spreadsheets, dashboards, and more.`,
    `Runs behind the firewall, without a cloud.`,
  ],
  small: [
    `Powerful apps in minutes, no configuration, no servers.`,
    `Workflows, spreadsheets, dashboards, and more.`,
    `Runs behind the firewall, without a cloud.`,
  ],
}

export function HeadSection() {
  let [measured, setMeasured] = useState(false)
  let setMeasuredDelayed = useDebounce(setMeasured, 1)
  let fontsLoaded = useWaitForFonts(['Eesti Pro'])
  let pSize = 16
  let [parSize, setParSize] = useState(pSize)
  const size = useScreenSize()

  if (!fontsLoaded) {
    return null
  }

  let texts = allTexts[size]
  let longest = texts.reduce((a, c) => (a.length > c.length ? a : c), '')

  return (
    <>
      <Page offset={0}>
        <Page.Content>
          <FullScreen>
            <Header />

            <Row height="80%" flex={1} alignItems="center" justifyContent="center">
              <View width="90%" maxWidth={900}>
                <FadeDown disable={!measured}>
                  <TitleText fontWeight={100} selectable>
                    <ViewPortText onReady={() => !measured && setMeasuredDelayed(true)}>
                      {allTitles[size]}
                    </ViewPortText>
                  </TitleText>

                  <ViewPortText style={{ opacity: 0 }} min={pSize} onReady={setParSize}>
                    {longest}
                  </ViewPortText>

                  <Paragraph
                    fontSize={parSize * 0.85}
                    sizeLineHeight={1.5}
                    textAlign="center"
                    fontWeight={100}
                    alpha={0.56}
                  >
                    <span style={{ fontWeight: 200 }}>{texts[0]}</span>
                    <br />
                    {texts[1]}
                    <br />
                    {texts[2]}
                  </Paragraph>
                </FadeDown>
              </View>
            </Row>

            <Row width="100%" height="40%" marginTop={'-20%'} position="relative">
              <View
                background={`url(${screen}) no-repeat top left`}
                backgroundSize="contain"
                flex={1}
                width="120%"
                maxWidth={1000}
                margin={['auto', 'auto', 0]}
                height={320}
                position="relative"
              >
                {DownloadButton}
              </View>

              <FullScreen minWidth={1512} margin={[0, -220]} top="auto">
                <img src={lineSep} />
              </FullScreen>

              <View position="absolute" bottom="10%" left={0} right={0}>
                <img style={{ margin: 'auto' }} src={macbook} />
              </View>
            </Row>
          </FullScreen>
        </Page.Content>

        <Page.Background background={theme => theme.background} />

        <Page.Parallax speed={1} zIndex={-2}>
          {/* <div style={{ width: 100, height: 100, background: 'red' }} /> */}
          <TopBlur />
          <View pointerEvents="none" position="absolute" top="30%" left={0} right={0} zIndex={1}>
            <img src={glow} />
          </View>
        </Page.Parallax>
      </Page>
    </>
  )
}

const DownloadButton = (
  <Center bottom="auto" top="4%">
    <Row width={159} height={45} position="relative" alignItems="center" justifyContent="center">
      <Image position="absolute" src={download} />
      <Text
        transform={{ y: 2 }}
        zIndex={1}
        size={1.1}
        fontWeight={500}
        letterSpacing={1}
        pointerEvents="none"
      >
        Download
      </Text>
      <div style={{ width: 25 }} />
    </Row>
  </Center>
)
