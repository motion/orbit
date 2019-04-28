import { FullScreen, gloss, Image, Row, Scale, Space, SurfacePassProps, Theme, toColor, View, ViewProps } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { memo, useEffect, useState } from 'react'

import glow from '../../../public/images/glow.svg'
import macbook from '../../../public/images/macbook.png'
import { colors } from '../../constants'
import { useScreenHeightVal, useScreenSize } from '../../hooks/useScreenSize'
import { FadeChild, fadeUpProps, useFadePage } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { TitleText } from '../../views/TitleText'
import { TopBlur } from '../../views/TopBlur'
import { useTextFit } from '../../views/useTextFit'
import { GradientDown } from './GradientDown'
import { Join } from './Join'
import { OuterSpace } from './OuterSpace'
import { useScreenVal } from './SpacedPageContent'

let smallSpc = <Space size="xxl" />
let medSpc = <Space size="xxl" />
let lgSpc = <Space size="xxl" />

let allTitles = {
  large: 'Easy, powerful apps with your team',
  medium: 'Easy, powerful apps with your team',
  small: 'Build amazing apps',
}

let allTexts = {
  large: [
    `Code internal tools and desktop apps that coordinate without a server.`,
    `Plug in data, apps, and more with a click.`,
  ],
  medium: [
    `Code powerful internal tools without configuration or servers.`,
    `Vertically integrated UI kit, dev environment & deploy.`,
  ],
  small: [`Code internal tools, no config or servers.`, `UI kit, dev environment & deploy.`],
}

const subTexts = {
  large: `Five ways Orbit makes common apps easy.`,
  medium: `Learn how Orbit makes common apps easy.`,
  small: `Learn how.`,
}

const HeadText = memo(() => {
  const screen = useScreenSize()
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const measured = fontsLoaded
  const titleFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const pFit = useTextFit({ min: 16, updateKey: fontsLoaded, extraScale: 1 })

  const texts = allTexts[screen]
  const longest = texts.reduce((a, c) => (a.length > c.length ? a : c), '')
  const br = useScreenVal(smallSpc, medSpc, lgSpc)

  return (
    <View
      className="head-text-section"
      width={useScreenVal('92%', '80%', '85%')}
      maxWidth={960}
      textAlign="center"
    >
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

      <Space size={useScreenVal('md', 'lg', 'xl')} />

      <View position="relative" width="90%" margin={[0, 'auto']}>
        {screen === 'small' ? (
          <Paragraph
            size={1.8}
            sizeLineHeight={1.4}
            margin={[0, 'auto']}
            textAlign="center"
            alpha={0.6}
            selectable
            zIndex={100}
          >
            Create incredibly powerful tools without config or a server, with everything included.
          </Paragraph>
        ) : (
          <Paragraph
            fontWeight={100}
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
          >
            <FadeChild disable={!measured} delay={400}>
              {texts[0]}
            </FadeChild>
            {br}
            <FadeChild disable={!measured} delay={500}>
              {texts[1]}
            </FadeChild>
            {br}
            <FadeChild {...fadeUpProps} disable={!measured} delay={650}>
              <Smaller>{subTexts[screen]}</Smaller>
            </FadeChild>
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
    </View>
  )
})

const Smaller = gloss({
  cursor: 'pointer',
  textDecoration: 'underline',
  textDecorationColor: '#222',
  transition: 'color ease 350ms',
  fontSize: 24,
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
  const Fade = useFadePage()

  return (
    <Fade.FadeProvide>
      <OuterSpace show={screen !== 'small'} />
      <Page zIndex={0} overflow="hidden" {...props}>
        <Page.Content>
          <FullScreen
            right={useScreenHeightVal(40, 0)}
            left={useScreenHeightVal(40, 0)}
            opacity={fontsLoaded ? 1 : 0}
            bottom={50}
          >
            <Row ref={Fade.ref} margin={['auto', 0]} alignItems="center" justifyContent="center">
              <HeadText />
            </Row>
          </FullScreen>
        </Page.Content>

        <Page.Parallax zIndex={1} speed={0}>
          <FullScreen userSelect="none" top="auto" transform={{ y: 50 }} zIndex={1000}>
            <FadeChild {...fadeUpProps} delay={600}>
              <View
                flex={1}
                width="100%"
                maxWidth={1000}
                margin={['auto', 'auto', 0]}
                height={220}
                position="relative"
                bottom={0}
              >
                {/* <View
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
                /> */}
                <FadeChild {...fadeUpProps} delay={500}>
                  <SurfacePassProps elevation={5} fontFamily="GT Eesti">
                    <Theme name="orbitOneDark">
                      <Scale size={1.1}>
                        <Join
                          inputProps={{
                            minWidth: useScreenVal('auto', 300, 300),
                          }}
                          borderRadius={1000}
                          boxShadow={[[0, 5, 40, [0, 0, 0.15]]]}
                          transform={{ y: -123 }}
                          flexFlow="row"
                          group
                          margin={[0, 'auto']}
                        />
                      </Scale>
                    </Theme>
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

        <Page.Parallax overflow="visible" speed={0} zIndex={-1}>
          <FullScreen zIndex={-100}>
            <View
              pointerEvents="none"
              position="absolute"
              top="15%"
              left={0}
              right={0}
              overflow="hidden"
              bottom={0}
              userSelect="none"
              opacity={0.2}
            >
              <FadeChild {...fadeUpProps}>
                <Image src={glow} />
              </FadeChild>
              <GradientDown top="50%" zIndex={100} />
            </View>
          </FullScreen>
        </Page.Parallax>

        <Page.Parallax speed={0} zIndex={-2}>
          <TopBlur opacity={0.7} />
        </Page.Parallax>
      </Page>
    </Fade.FadeProvide>
  )
}

const RoundButton = ({ primary = colors.red, ...props }: ViewProps & { primary?: any }) => (
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
