import { Center, FullScreen, gloss, Image, Row, Space, toColor, useDebounce, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { useEffect, useState } from 'react'
import downmark from '../../../public/images/down-mark.svg'
import glow from '../../../public/images/glow.svg'
import lineSep from '../../../public/images/line-sep.svg'
import macbook from '../../../public/images/macbook.png'
import screen from '../../../public/images/screen.jpg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeIn } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { Text } from '../../views/Text'
import { TitleText } from '../../views/TitleText'
import { TopBlur } from '../../views/TopBlur'
import { useTextFit } from '../../views/useTextFit'
import { OuterSpace } from './OuterSpace'

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

const br = <br style={{ height: 0 }} />

function HeadText() {
  const size = useScreenSize()
  const [measured, setMeasured] = useState(false)
  const setMeasuredDelayed = useDebounce(setMeasured, 1)
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const titleFit = useTextFit({ updateKey: fontsLoaded })
  const pFit = useTextFit({ min: 16, updateKey: fontsLoaded })

  useEffect(() => {
    setMeasuredDelayed(true)
  }, [])

  const texts = allTexts[size]
  const longest = texts.reduce((a, c) => (a.length > c.length ? a : c), '')

  return (
    <View justifyContent="space-between" width="90%" maxWidth={980} textAlign="center">
      <FadeIn disable={!measured}>
        <TitleText
          forwardRef={titleFit.ref}
          style={titleFit.style}
          fontWeight={100}
          margin={[0, 'auto']}
          // transition="transform ease 160ms"
          transformOrigin="top center"
          selectable
          textAlign="center"
        >
          {allTitles[size]}
        </TitleText>
      </FadeIn>

      <Space size="lg" />

      <FadeIn disable={!measured}>
        <Paragraph
          style={pFit.style}
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
      </FadeIn>

      {/* this is just to measure */}
      <Paragraph
        ref={pFit.ref}
        style={pFit.style}
        opacity={0}
        position="absolute"
        pointerEvents="none"
      >
        {longest}
      </Paragraph>
    </View>
  )
}

export function HeadSection(props) {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const [hoverDownload, setHoverDownload] = useState(false)
  return (
    <>
      <OuterSpace show={hoverDownload} />
      <Page zIndex={0} {...props}>
        <Page.Content>
          <FullScreen opacity={fontsLoaded ? 1 : 0}>
            <Row
              transform={{ y: '-60%' }}
              margin={['auto', 0]}
              alignItems="center"
              justifyContent="center"
            >
              <HeadText />
            </Row>

            <Space size="xxxl" />
            <Space size="xxxl" />

            <FullScreen top="auto">
              <FadeIn from={{ transform: `translate3d(0,20px,0)` }}>
                <View
                  flex={1}
                  width="100%"
                  maxWidth={1000}
                  margin={['auto', 'auto', 0]}
                  height={220}
                  position="relative"
                  bottom={65}
                >
                  <View
                    position="absolute"
                    overflow="hidden"
                    backgroundColor="#000"
                    backgroundImage={`url(${screen})`}
                    backgroundSize="contain"
                    backgroundPosition="center center"
                    backgroundRepeat="no-repeat"
                    borderRadius={10}
                    width="100%"
                    height="100%"
                    zIndex={-1}
                  />
                  <DownloadButton
                    onMouseEnter={() => setHoverDownload(true)}
                    onMouseLeave={() => setHoverDownload(false)}
                  />
                </View>
              </FadeIn>

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
                <Image
                  position="absolute"
                  top={0}
                  transform={{ scale: 0.5 }}
                  transformOrigin="top center"
                  src={macbook}
                />
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
            opacity={0.4}
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
    </>
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

const DownloadButton = props => (
  <FadeIn>
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
        border={[1, '#21AA0F']}
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
        {...props}
      >
        <Image userSelect="none" position="absolute" right={22} src={downmark} />
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
  </FadeIn>
)
