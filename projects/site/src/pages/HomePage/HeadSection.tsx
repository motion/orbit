import { Col, gloss, Scale, Space, SurfacePassProps, Theme, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { memo } from 'react'

import { useScreenHeightVal, useScreenSize } from '../../hooks/useScreenSize'
import { linkProps } from '../../LinkState'
import { FadeChild, fadeUpProps, useFadePage } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { TitleText } from '../../views/TitleText'
import { useTextFit } from '../../views/useTextFit'
import { Join } from './Join'
import { useScreenVal } from './SpacedPageContent'

let smallSpc = <Space size="xl" />
let medSpc = <Space size="xxl" />

let allTitles = {
  large: 'Collaborative, decentralized apps',
  medium: 'Collaborative, decentralized apps',
  small: 'Collaborative, decentralized apps',
}

let allTexts = {
  large: [
    `A new platform to create and share incredible apps.`,
    `Data-first, easy to build, built for internal tools, under your control.`,
  ],
  medium: [
    `A new platform to create and share incredible apps.`,
    `Data-first, easy to build, built for internal tools, under your control.`,
  ],
  small: [
    `A new platform to create and share incredible apps.`,
    `Data-first, easy to build, built for internal tools, under your control.`,
  ],
}

const subTexts = {
  large: `How Orbit lets you build internal tools in no time.`,
  medium: `How Orbit lets you build internal tools in no time.`,
  small: `How Orbit solves internal tools.`,
}

const HeadContent = memo(() => {
  const screen = useScreenSize()
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const measured = fontsLoaded
  const titleFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const pFit = useTextFit({ min: 16, updateKey: fontsLoaded, extraScale: 1 })

  const texts = allTexts[screen]
  const longest = texts.reduce((a, c) => (a.length > c.length ? a : c), '')
  const br = useScreenVal(smallSpc, medSpc, medSpc)

  const textsWidth = useScreenVal('95%', '100%', '90%')

  const isSmall = screen === 'small'

  return (
    <View
      className="head-text-section"
      width={useScreenVal('95%', '88%', '85%')}
      maxWidth={960}
      textAlign="center"
    >
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
        <FadeChild disable={!measured}>{allTitles[screen]}</FadeChild>
      </TitleText>

      <Space size={useScreenVal('md', 'lg', 'xl')} />

      {isSmall && (
        <Paragraph
          size={1.8}
          sizeLineHeight={1.4}
          margin={[0, 'auto']}
          textAlign="center"
          alpha={0.6}
          selectable
          zIndex={100}
        >
          {texts[0]} {texts[1]}
        </Paragraph>
      )}

      <View
        maxHeight={isSmall ? 0 : 'auto'}
        overflow={isSmall ? 'hidden' : 'auto'}
        position="relative"
        flex={1}
        width={textsWidth}
        margin={[0, 'auto']}
        maxWidth="80%"
      >
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
          fontSize={40}
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
          {texts[2] && (
            <>
              <FadeChild disable={!measured} delay={600}>
                {texts[2]}
              </FadeChild>
              {br}
            </>
          )}
          <FadeChild {...fadeUpProps} disable={!measured} delay={650}>
            <Smaller {...linkProps('/apps#faq')}>{subTexts[screen]}</Smaller>
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
    </View>
  )
})

const HeadJoin = () => (
  <View
    flex={1}
    width="100%"
    maxWidth={1000}
    margin={[0, 'auto']}
    position="relative"
    bottom={0}
    alignItems="center"
  >
    <FadeChild {...fadeUpProps} delay={500}>
      <SurfacePassProps elevation={5} fontFamily="GT Eesti">
        <Theme name="orbitOneDark">
          <Scale size={1.1}>
            <Join
              inputProps={{
                minWidth: useScreenVal('auto', 300, 300),
                textAlign: 'left',
              }}
              borderRadius={1000}
              boxShadow={[[0, 5, 40, [0, 0, 0, 0.15]]]}
              flexFlow="row"
              group
              margin={[0, '-2%']}
            />
          </Scale>
        </Theme>
      </SurfacePassProps>
    </FadeChild>
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
    {/* <DownloadButton
          onMouseEnter={() => setHoverDownload(true)}
          onMouseLeave={() => setHoverDownload(false)}
        /> */}
  </View>
)

const Smaller = gloss({
  cursor: 'pointer',
  textDecoration: 'underline',
  textDecorationColor: '#222',
  transition: 'color ease 350ms',
  fontSize: 30,
  marginTop: 12,
}).theme((props, theme) => ({
  ...props,
  color: theme.color.alpha(0.5),
  '&:hover': {
    color: theme.color.alpha(1),
  },
}))

export function HeadSection() {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const Fade = useFadePage()

  return (
    <Fade.FadeProvide>
      {/* <Page.Background background="linear-gradient(#000, #222)" /> */}
      {/* <Page.Parallax>
        <Center>
          <View transform={{ scale: 30 }}>
            <BrandMark />
          </View>
        </Center>
      </Page.Parallax> */}

      <Page.Content>
        <Col
          right={useScreenHeightVal(40, 0)}
          left={useScreenHeightVal(40, 0)}
          opacity={fontsLoaded ? 1 : 0}
          margin={['auto', 0]}
        >
          <Space size="xxxl" />
          <Col ref={Fade.ref} margin={['auto', 0]} alignItems="center" justifyContent="center">
            <HeadContent />
          </Col>
          <Space size="xxl" />
          <HeadJoin />
        </Col>
      </Page.Content>
    </Fade.FadeProvide>
  )
}

// {false && (
//   <Page.Parallax zIndex={1} speed={0}>
//     <FullScreen userSelect="none" top="auto" transform={{ y: 50 }} zIndex={1000}>
//       <View
//         position="absolute"
//         bottom="12%"
//         left={0}
//         right={0}
//         alignItems="center"
//         justifyContent="center"
//         height={160}
//       >
//         <View
//           height={160}
//           margin={[0, 'auto']}
//           width={200}
//           position="relative"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <Image
//             position="absolute"
//             top={0}
//             transform={{ scale: 0.5 }}
//             transformOrigin="top center"
//             src={macbook}
//           />
//           <View
//             className="macbook-shadow"
//             boxShadow={[[0, 20, 80, 10, '#000']]}
//             zIndex={-1}
//             position="absolute"
//             top={10}
//             left={0}
//             right={0}
//             bottom={10}
//           />
//           <RoundButton aria-label="See how Orbit Works" primary="#290C3C" padding={[10, 20]}>
//             See how Orbit works
//           </RoundButton>
//         </View>
//       </View>
//     </FullScreen>
//   </Page.Parallax>
// )}

// const RoundButton = ({ primary = colors.red, ...props }: ViewProps & { primary?: any }) => (
//   <View
//     tagName="a"
//     flexFlow="row"
//     position="relative"
//     alignItems="center"
//     justifyContent="center"
//     border={[2, primary]}
//     borderRadius={100}
//     background="#080412"
//     backgroundSize="105% 200%"
//     transition="all ease 300ms"
//     hoverStyle={{
//       border: [2, toColor(primary).lighten(0.3)],
//     }}
//     textDecoration="none"
//     {...props}
//   />
// )

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
