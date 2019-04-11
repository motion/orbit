import { Center, FullScreen, Image, Row, Title, useDebounce, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { Fragment, useState } from 'react'
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
    `Make powerful apps in minutes with no configuration and deploy without a server.`,
    `Custom internal tools made easy. Workflows, spreadsheets, dashboards, and more.`,
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
        <Page.Content background={theme => theme.background}>
          <TopBlur />
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
                    fontSize={parSize * 0.94}
                    sizeLineHeight={1.5}
                    textAlign="center"
                    fontWeight={300}
                    alpha={0.5}
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

            <View
              pointerEvents="none"
              position="absolute"
              top="30%"
              left={0}
              right={0}
              zIndex={1}
              opacity={0}
            >
              <img src={glow} />
            </View>

            <Row width="100%" height="40%" position="relative">
              <View
                background={`url(${screen}) no-repeat top left`}
                backgroundSize="contain"
                flex={1}
                margin={[0, -120]}
              />

              <FullScreen minWidth={1512} margin={[0, -220]} top="auto">
                <img src={lineSep} />
              </FullScreen>

              <View position="absolute" bottom="10%" left={0} right={0}>
                <img style={{ margin: 'auto' }} src={macbook} />
              </View>

              <Center bottom="auto" top="4%">
                <Row
                  width={159}
                  height={45}
                  position="relative"
                  alignItems="center"
                  justifyContent="center"
                >
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
            </Row>
          </FullScreen>
        </Page.Content>

        <Page.Parallax speed={-1}>
          <div style={{ width: 100, height: 100, background: 'red' }} />
          <Title>Test me out</Title>
        </Page.Parallax>
      </Page>
    </>
  )
}
