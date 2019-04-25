import { Center, FullScreen, gloss, Image, Row, Space, toColor, useDebounce, View, ViewProps } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { useEffect, useState } from 'react'

import downmark from '../../../public/images/down-mark.svg'
import glow from '../../../public/images/glow.svg'
import lineSep from '../../../public/images/line-sep.svg'
import macbook from '../../../public/images/macbook.png'
import appScreen from '../../../public/images/screen.jpg'
import { colors, IS_CHROME } from '../../constants'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeIn, fadeUpProps } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContent } from '../../views/SectionContent'
import { Text } from '../../views/Text'
import { TitleText } from '../../views/TitleText'
import { TopBlur } from '../../views/TopBlur'
import { useTextFit } from '../../views/useTextFit'
import { useParallax } from '../HomePage'
import { OuterSpace } from './OuterSpace'
import { useScreenVal } from './SpacedPageContent'

let smallSpc = <Space size="xxl" />
let medSpc = <Space size="xxl" />
let lgSpc = <Space size="xxl" />

let allTitles = {
  large: 'Apps without servers',
  medium: 'Apps without servers',
  small: 'Apps without servers',
}

let allTexts = {
  large: [
    `Create powerful internal apps your team can use without setting up a server.`,
    `It's the desktop app platform for internal tools & more.`,
  ],
  medium: [
    `Code powerful internal tools without configuration or servers.`,
    `Vertically integrated UI kit, dev environment & deploy.`,
  ],
  small: [`Code internal tools, no config or servers.`, `UI kit, dev environment & deploy.`],
}

const subTexts = {
  large: `The five ways Orbit saves you more time.`,
  medium: `Learn how Orbit makes common apps easy.`,
  small: `Learn how.`,
}

function HeadText() {
  const screen = useScreenSize()
  const [measured, setMeasured] = useState(false)
  const setMeasuredDelayed = useDebounce(setMeasured, 1)
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const titleFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const pFit = useTextFit({ min: 16, updateKey: fontsLoaded })

  useEffect(() => {
    setMeasuredDelayed(true)
  }, [])

  const texts = allTexts[screen]
  const longest = texts.reduce((a, c) => (a.length > c.length ? a : c), '')
  const br = useScreenVal(smallSpc, medSpc, lgSpc)

  return (
    <View justifyContent="space-between" width="90%" maxWidth={960} textAlign="center">
      <FadeIn disable={!measured}>
        <TitleText
          forwardRef={titleFit.ref}
          style={titleFit.style}
          fontWeight={100}
          margin={[0, '-5%']}
          alignSelf="center"
          // transition="transform ease 160ms"
          transformOrigin="top center"
          selectable
          textAlign="center"
          whiteSpace="nowrap"
        >
          {allTitles[screen]}
        </TitleText>
      </FadeIn>

      <Space size={useScreenVal('md', 'lg', 'xl')} />

      {screen === 'small' ? (
        <Paragraph
          size={1.5}
          sizeLineHeight={1.4}
          margin={[0, 'auto']}
          textAlign="center"
          alpha={0.6}
        >
          Create incredibly powerful tools without config or a server, with everything included.
        </Paragraph>
      ) : (
        <Paragraph
          style={{
            ...pFit.style,
            height: 'auto',
          }}
          lineHeight={pFit.isMeasured ? `${pFit.height}px` : `40px`}
          height="auto"
          transformOrigin="top left"
          margin={[0, 'auto']}
          textAlign="center"
          alpha={0.8}
          whiteSpace="nowrap"
        >
          <FadeIn disable={!measured} delay={150}>
            {texts[0]}
          </FadeIn>
          {br}
          <FadeIn disable={!measured} delay={300}>
            {texts[1]}
          </FadeIn>
          {br}

          <Smaller fontSize={screen === 'large' ? '70%' : '90%'}>
            <FadeIn {...fadeUpProps} delay={500}>
              {subTexts[screen]}
            </FadeIn>
          </Smaller>
        </Paragraph>
      )}

      {/* this is just to measure */}
      <Paragraph
        className="measure-p"
        ref={pFit.ref}
        opacity={0}
        fontSize={40}
        position="absolute"
        whiteSpace="pre"
        pointerEvents="none"
      >
        {longest}
      </Paragraph>
    </View>
  )
}

const Smaller = gloss({
  cursor: 'pointer',
  textDecoration: 'underline',
  textDecorationColor: '#222',
  transition: 'all ease 350ms',
}).theme((props, theme) => ({
  ...props,
  color: theme.color.alpha(0.5),
  '&:hover': {
    color: theme.color.alpha(1),
  },
}))

export function HeadSection(props) {
  const screen = useScreenSize()
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const [hoverDownload, setHoverDownload] = useState(true)

  useEffect(() => {
    let tm = setTimeout(() => {
      setHoverDownload(false)
    }, 7000)
    return () => clearTimeout(tm)
  }, [])

  return (
    <>
      <OuterSpace show={hoverDownload && screen !== 'small'} />
      <Page zIndex={0} overflow="hidden" {...props}>
        <Page.Content>
          <FullScreen opacity={fontsLoaded ? 1 : 0}>
            <Row
              transform={{
                y: -50,
              }}
              margin={['auto', 0]}
              alignItems="center"
              justifyContent="center"
            >
              <HeadText />
            </Row>

            <FullScreen top="auto">
              <FadeIn {...fadeUpProps}>
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
                    backgroundColor="#00000033"
                    backgroundImage={`url(${appScreen})`}
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
                <FadeIn {...fadeUpProps}>
                  <img src={lineSep} />
                </FadeIn>
                <View
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  height={200}
                  transform={{ y: 400 }}
                  background={theme => theme.background}
                />
              </FullScreen>

              {false && (
                <View
                  position="absolute"
                  bottom="12%"
                  left={0}
                  right={0}
                  alignItems="center"
                  justifyContent="center"
                  height={160}
                >
                  <View
                    height={160}
                    margin={[0, 'auto']}
                    width={200}
                    position="relative"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      position="absolute"
                      top={0}
                      transform={{ scale: 0.5 }}
                      transformOrigin="top center"
                      src={macbook}
                    />
                    <View
                      className="macbook-shadow"
                      boxShadow={[[0, 20, 80, 10, '#000']]}
                      zIndex={-1}
                      position="absolute"
                      top={10}
                      left={0}
                      right={0}
                      bottom={10}
                    />
                    <RoundButton
                      aria-label="See how Orbit Works"
                      primary="#290C3C"
                      padding={[10, 20]}
                    >
                      See how Orbit works
                    </RoundButton>
                  </View>
                </View>
              )}
            </FullScreen>
          </FullScreen>
        </Page.Content>

        <Page.Background
          zIndex={-3}
          opacity={0.38}
          backgroundSize="cover"
          backgroundImage={`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%23040404' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%23070707' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%230b0b0b' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%230e0e0e' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%23111111' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%23151515' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%23181818' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%231b1b1b' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%231f1f1f' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%23222222' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E")`}
        />

        {IS_CHROME && (
          <Page.Parallax speed={0.2} zIndex={-2}>
            <SectionContent position="relative" flex={1}>
              <View
                pointerEvents="none"
                position="absolute"
                top="45%"
                left={0}
                right={0}
                overflow="hidden"
                bottom={60}
                zIndex={1}
                opacity={0.35}
                transform={{
                  scale: 1.5,
                }}
              >
                <FadeIn {...fadeUpProps}>
                  <img src={glow} />
                </FadeIn>
              </View>
            </SectionContent>
          </Page.Parallax>
        )}

        <Page.Parallax speed={0} zIndex={-2}>
          <TopBlur opacity={0.6} />
        </Page.Parallax>
      </Page>
    </>
  )
}

const RoundButton = ({ primary = colors.red, ...props }: ViewProps & { primary?: string }) => (
  <View
    tagName="a"
    href="ok"
    flexFlow="row"
    position="relative"
    alignItems="center"
    justifyContent="center"
    border={[2, primary]}
    borderRadius={100}
    background="#080412"
    backgroundSize="105% 200%"
    transition="all ease 300ms"
    hoverStyle={{
      border: [2, toColor(primary).lighten(0.3)],
    }}
    textDecoration="none"
    {...props}
  />
)

const DownloadButton = props => {
  const parallax = useParallax()
  return (
    <FadeIn>
      <Center bottom="auto" top={-20}>
        <RoundButton
          aria-label="Download Button"
          width={159}
          height={45}
          onClick={e => {
            e.preventDefault()
            parallax.scrollTo(5)
          }}
          {...props}
        >
          <Image userSelect="none" position="absolute" right={22} src={downmark} />
          <Text zIndex={1} size={1.15} fontWeight={700} letterSpacing={1} pointerEvents="none">
            Download
          </Text>
          <div style={{ width: 25 }} />
        </RoundButton>
      </Center>
    </FadeIn>
  )
}
