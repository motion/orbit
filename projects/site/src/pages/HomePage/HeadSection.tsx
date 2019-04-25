import { FullScreen, gloss, Image, Row, Scale, Space, SurfacePassProps, toColor, useDebounce, View, ViewProps } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { useEffect, useState } from 'react'

import glow from '../../../public/images/glow.svg'
import macbook from '../../../public/images/macbook.png'
import appScreen from '../../../public/images/screen.jpg'
import { colors } from '../../constants'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeChild, fadeUpProps, useFadePage } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContent } from '../../views/SectionContent'
import { TitleText } from '../../views/TitleText'
import { TopBlur } from '../../views/TopBlur'
import { useTextFit } from '../../views/useTextFit'
import { Join } from './EarlyAccessBetaSection'
import { OuterSpace } from './OuterSpace'
import { useScreenVal } from './SpacedPageContent'

let smallSpc = <Space size="xxl" />
let medSpc = <Space size="xxl" />
let lgSpc = <Space size={65} />

let allTitles = {
  large: 'Amazing apps in minutes',
  medium: 'Apps without servers',
  small: 'Apps without servers',
}

let allTexts = {
  large: [
    `The ideal internal tool platform for teams. Move faster without servers.`,
    `Orbit includes a massive toolkit for building beautiful, flexible, apps.`,
  ],
  medium: [
    `Code powerful internal tools without configuration or servers.`,
    `Vertically integrated UI kit, dev environment & deploy.`,
  ],
  small: [`Code internal tools, no config or servers.`, `UI kit, dev environment & deploy.`],
}

const subTexts = {
  large: `Five ways Orbit improves the state of the art.`,
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
      <FadeChild disable={!measured}>
        <TitleText
          forwardRef={titleFit.ref}
          style={titleFit.style}
          fontWeight={100}
          alignSelf="center"
          // transition="transform ease 160ms"
          transformOrigin="top center"
          selectable
          textAlign="center"
          whiteSpace="nowrap"
        >
          {allTitles[screen]}
        </TitleText>
      </FadeChild>

      <Space size={useScreenVal('md', 'lg', 'xxl')} />

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
        <View margin={[0, '10%']} position="relative">
          <Paragraph
            tagName="div"
            style={{
              ...pFit.style,
              height: 'auto',
            }}
            lineHeight={pFit.isMeasured ? `${pFit.height}px` : `40px`}
            height="auto"
            transformOrigin="top left"
            margin={[0, 'auto']}
            textAlign="center"
            alpha={0.7}
            whiteSpace="nowrap"
            width="80%"
          >
            <FadeChild disable={!measured} delay={150}>
              {texts[0]}
            </FadeChild>
            {br}
            <FadeChild disable={!measured} delay={300}>
              {texts[1]}
            </FadeChild>
            {br}
            <FadeChild {...fadeUpProps} disable={!measured} delay={450}>
              <Smaller>{subTexts[screen]}</Smaller>
            </FadeChild>
          </Paragraph>

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
      )}
    </View>
  )
}

const Smaller = gloss({
  cursor: 'pointer',
  textDecoration: 'underline',
  textDecorationColor: '#222',
  transition: 'color ease 350ms',
  fontSize: '80%',
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
  const Fade = useFadePage()

  useEffect(() => {
    let tm = setTimeout(() => {
      setHoverDownload(false)
    }, 7000)
    return () => clearTimeout(tm)
  }, [])

  return (
    <Fade.FadeProvide>
      <OuterSpace show={hoverDownload && screen !== 'small'} />
      <Page zIndex={0} overflow="hidden" {...props}>
        <Page.Content>
          <FullScreen opacity={fontsLoaded ? 1 : 0}>
            <Row ref={Fade.ref} margin={['auto', 0]} alignItems="center" justifyContent="center">
              <HeadText />
            </Row>
          </FullScreen>
        </Page.Content>

        <Page.Parallax zIndex={1} speed={0.01}>
          <FullScreen top="auto" transform={{ y: 50 }} zIndex={1000}>
            <FadeChild {...fadeUpProps} delay={200}>
              <View
                flex={1}
                width="100%"
                maxWidth={1000}
                margin={['auto', 'auto', 0]}
                height={220}
                position="relative"
                bottom={0}
              >
                <View
                  position="absolute"
                  overflow="hidden"
                  backgroundImage={`url(${appScreen})`}
                  backgroundSize="cover"
                  backgroundPosition="center center"
                  backgroundRepeat="no-repeat"
                  borderRadius={10}
                  width="100%"
                  height="100%"
                  zIndex={-1}
                  boxShadow={[[0, 0, 100, [0, 0, 0]]]}
                  pointerEvents="auto"
                />
                <FadeChild {...fadeUpProps} delay={500}>
                  <SurfacePassProps elevation={5} fontFamily="GT Eesti">
                    <Scale size={1.1}>
                      <Join transform={{ y: -23 }} flexFlow="row" group margin={[0, 'auto']} />
                    </Scale>
                  </SurfacePassProps>
                </FadeChild>
                {/* <DownloadButton
                    onMouseEnter={() => setHoverDownload(true)}
                    onMouseLeave={() => setHoverDownload(false)}
                  /> */}
              </View>
            </FadeChild>

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
        </Page.Parallax>

        <Page.Parallax speed={0} zIndex={-1}>
          <FullScreen zIndex={-100}>
            <SectionContent position="absolute" flex={1}>
              <View
                pointerEvents="none"
                position="absolute"
                top="45%"
                left={0}
                right={0}
                overflow="hidden"
                bottom={60}
                opacity={0.35}
                transform={{
                  y: '45%',
                  scale: 1.75,
                }}
              >
                <FadeChild {...fadeUpProps}>
                  <img src={glow} />
                </FadeChild>
              </View>
            </SectionContent>
          </FullScreen>
        </Page.Parallax>

        <Page.Parallax speed={0} zIndex={-2}>
          <TopBlur opacity={0.7} />
        </Page.Parallax>
      </Page>
    </Fade.FadeProvide>
  )
}

const RoundButton = ({ primary = colors.red, ...props }: ViewProps & { primary?: string }) => (
  <View
    tagName="a"
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

// const DownloadButton = props => {
//   const parallax = useParallax()
//   return (
//     <FadeChild delay={1000}>
//       <Center bottom="auto" top={0}>
//         <RoundButton
//           aria-label="Download Button"
//           width={159}
//           height={45}
//           onClick={e => {
//             e.preventDefault()
//             parallax.scrollTo(5)
//           }}
//           {...props}
//         >
//           <Image userSelect="none" position="absolute" right={22} src={downmark} />
//           <Text zIndex={1} size={1.15} fontWeight={700} letterSpacing={1} pointerEvents="none">
//             Download
//           </Text>
//           <div style={{ width: 25 }} />
//         </RoundButton>
//       </Center>
//     </FadeChild>
//   )
// }
