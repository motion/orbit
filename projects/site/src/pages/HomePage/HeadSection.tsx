import { Center, FullScreen, Image, Row, Theme, useDebounce, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { Fragment, useState } from 'react'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import download from '../../../public/images/download.svg'
import glow from '../../../public/images/glow.svg'
import lineSep from '../../../public/images/line-sep.svg'
import macbook from '../../../public/images/macbook.png'
import screen from '../../../public/images/screen.jpg'
import { Header } from '../../components/Header'
import { FadeDown } from '../../views/FadeDown'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { Text } from '../../views/Text'
import { TitleText } from '../../views/TitleText'
import { TopBlur } from '../../views/TopBlur'
import { ViewPortText } from '../../views/ViewPortText'

export function HeadSection() {
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
          <FullScreen background={theme => theme.background} />
          <TopBlur />
          <FullScreen>
            <Page>
              <Header />

              <Row height="80%" flex={1} alignItems="center" justifyContent="center">
                <View width="90%">
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
                      fontWeight={100}
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
              >
                <img src={glow} />
              </View>

              <Row width="100%" height={340} position="relative">
                <View
                  background={`url(${screen}) no-repeat top left`}
                  backgroundSize="contain"
                  flex={1}
                  margin={[0, -120]}
                />

                <FullScreen minWidth={1512} margin={[0, -220]} top="auto">
                  <img src={lineSep} />
                </FullScreen>

                <Center marginTop={100}>
                  <img src={macbook} />
                </Center>

                <Center bottom="auto" top="16%">
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
            </Page>
          </FullScreen>
        </Theme>
      </ParallaxLayer>
    </Parallax>
  )
}
