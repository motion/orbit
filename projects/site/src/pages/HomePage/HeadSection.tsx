import { Center, FullScreen, gloss, Image, Row, Space, toColor, useDebounce, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { useEffect, useState } from 'react'
import downmark from '../../../public/images/down-mark.svg'
import glow from '../../../public/images/glow.svg'
import lineSep from '../../../public/images/line-sep.svg'
import macbook from '../../../public/images/macbook.png'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeDown } from '../../views/FadeDown'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { Text } from '../../views/Text'
import { TitleText } from '../../views/TitleText'
import { TopBlur } from '../../views/TopBlur'
import { useTextFit } from '../../views/useTextFit'

let allTitles = {
  large: 'A better way to build apps together.',
  medium: 'A new way to build apps together.',
  small: 'Build apps together.',
}

let allTexts = {
  large: [
    `Create any app you can dream, with barely any code and deploy without infrastructure.`,
    `It's the vertically integrated app platform for developers.`,
    `Open source, decentralized and offline-first.`,
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
  const [measured, setMeasured] = useState(false)
  const setMeasuredDelayed = useDebounce(setMeasured, 1)
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const size = useScreenSize()
  const { ref: titleRef, ...titleStyle } = useTextFit({ updateKey: fontsLoaded })
  const { ref, ...style } = useTextFit({ min: 16, updateKey: fontsLoaded })

  useEffect(() => {
    setMeasuredDelayed(true)
  }, [])

  const texts = allTexts[size]
  const longest = texts.reduce((a, c) => (a.length > c.length ? a : c), '')

  const br = <br style={{ height: 0 }} />

  return (
    <Page offset={0} zIndex={-1}>
      <Page.Content>
        <FullScreen opacity={fontsLoaded ? 1 : 0}>
          <Row
            transform={{ y: '-60%' }}
            margin={['auto', 0]}
            alignItems="center"
            justifyContent="center"
          >
            <View justifyContent="space-between" width="90%" maxWidth={980} textAlign="center">
              <FadeDown disable={!measured}>
                <TitleText
                  forwardRef={titleRef}
                  {...titleStyle}
                  fontWeight={100}
                  margin={[0, 'auto']}
                  // transition="transform ease 160ms"
                  transformOrigin="top center"
                  selectable
                  textAlign="center"
                >
                  {allTitles[size]}
                </TitleText>
              </FadeDown>

              <Space size="lg" />

              <Paragraph
                {...style}
                height="auto"
                transformOrigin="top center"
                sizeLineHeight={1.3}
                margin={[0, 'auto']}
                textAlign="center"
                alpha={0.56}
                whiteSpace="nowrap"
              >
                {texts[0]}
                {br}
                {texts[1]}
                {br}
                {texts[2]}
              </Paragraph>

              {/* this is just to measure */}
              <Paragraph ref={ref} {...style} opacity={0} position="absolute" pointerEvents="none">
                {longest}
              </Paragraph>
            </View>
          </Row>

          <Space size="xl" />

          <FullScreen top="auto">
            <View
              // background={`url(${screen}) no-repeat top left`}
              background="#222"
              borderRadius={10}
              backgroundSize="contain"
              flex={1}
              width="100%"
              maxWidth={1000}
              margin={['auto', 'auto', 0]}
              height={320}
              position="relative"
            >
              {DownloadButton}
            </View>

            <FullScreen minWidth={1512} margin={[0, -220]} top="auto">
              <img src={lineSep} />
              <View
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                height={400}
                transform={{ y: 400 }}
                background={theme => theme.background}
              />
            </FullScreen>

            <View
              position="absolute"
              bottom="12%"
              left={0}
              right={0}
              alignItems="center"
              justifyContent="center"
              height={160}
            >
              <img style={{ position: 'absolute', top: 0 }} src={macbook} />
              <PreviewButton>See the Orbit Demo</PreviewButton>
            </View>
          </FullScreen>
        </FullScreen>
      </Page.Content>

      <Page.Parallax speed={-0.2} zIndex={-2}>
        <View
          pointerEvents="none"
          position="absolute"
          top="30%"
          left={0}
          right={0}
          zIndex={1}
          opacity={0.3}
          transform={{
            scale: 1.3,
          }}
        >
          <img src={glow} />
        </View>
      </Page.Parallax>

      <Page.Parallax speed={0} zIndex={-2}>
        <TopBlur opacity={0.6} />
      </Page.Parallax>
    </Page>
  )
}

const PreviewButton = gloss({
  padding: [10, 30],
  background: '#290C3C',
  border: [1, [255, 255, 255, 0.3]],
  borderRadius: 10,
  color: [255, 255, 255, 0.8],
  zIndex: 10,
  boxShadow: [[0, 20, 20, [0, 0, 0, 0.5]]],
  transition: 'all ease 300ms',
  cursor: 'pointer',
  fontWeight: 500,
  '&:hover': {
    color: [255, 255, 255, 1],
    background: toColor('#290C3C').lighten(0.2),
  },
})

const DownloadButton = (
  <Center bottom="auto" top={-20}>
    <View
      tagName="a"
      {...{ href: 'ok' }}
      flexFlow="row"
      width={159}
      height={45}
      position="relative"
      alignItems="center"
      justifyContent="center"
      border={[3, '#21AA0F']}
      borderRadius={100}
      background={theme => theme.background}
      hoverStyle={{
        border: [3, toColor('#21AA0F').lighten(0.3)],
      }}
      textDecoration="none"
      onClick={e => {
        e.preventDefault()
        console.log('need to link downlaod')
      }}
    >
      <Image position="absolute" right={22} src={downmark} />
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
    </View>
  </Center>
)
