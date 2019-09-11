import { Col, Scale, Space, SurfacePassProps, Theme, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { memo } from 'react'

import { fontProps } from '../../constants'
import { useScreenHeightVal } from '../../hooks/useScreenSize'
import { fadeAnimations, FadeChild, useFadePage } from '../../views/FadeInView'
import { Paragraph } from '../../views/Paragraph'
import { TitleText } from '../../views/TitleText'
import { useTextFit } from '../../views/useTextFit'
import { Join } from './Join'
import { useScreenVal } from './SpacedPageContent'

const texts = `
The beautiful, moldable app platform for teams.
Orbit is an all-new platform for internal apps.
`
  .trim()
  .split(/\n/g)

const HeadContent = memo(() => {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const measured = fontsLoaded
  const titleFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const longest = texts.reduce((a, c) => (a.length > c.length ? a : c), '')
  const br = <View sm-height={20} height={30} lg-height={40} />

  return (
    <View
      className="head-text-section"
      width="max(95vw, 80%)"
      maxWidth={960}
      textAlign="center"
      alignItems="center"
    >
      <TitleText
        nodeRef={titleFit.ref}
        style={titleFit.style}
        fontWeight={100}
        alignSelf="center"
        transformOrigin="top center"
        selectable
        textAlign="center"
        whiteSpace="nowrap"
        maxHeight={160}
      >
        <FadeChild disable={!measured}>The Smart HUD</FadeChild>
      </TitleText>

      {br}

      <View position="relative" flex={1} width="90%" margin={[0, 'auto']} maxWidth="80%">
        <Paragraph
          fontWeight={400}
          tagName="div"
          height="auto"
          transformOrigin="top center"
          margin={[0, 'auto']}
          textAlign="center"
          alpha={0.7}
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
          {/* <FadeChild {...fadeUpProps} disable={!measured} delay={650}>
            <Smaller {...linkProps('/apps#faq')}>{subTexts[screen]}</Smaller>
          </FadeChild> */}
        </Paragraph>

        {/* this is just to measure */}
        <Paragraph
          className="measure-p"
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

const HeadJoin = memo(() => {
  return (
    <View flex={1} width="100%" position="absolute" bottom="15%" alignItems="center">
      <FadeChild {...fadeAnimations.up} delay={500}>
        <SurfacePassProps elevation={5} {...fontProps.TitleFont}>
          <Theme name="orbitOneDark">
            <Scale size={useScreenVal(0.9, 1, 1.1)}>
              <Join
                inputProps={{
                  minWidth: useScreenVal('auto', 300, 300),
                  textAlign: 'left',
                }}
                borderRadius={1000}
                boxShadow={[[0, 5, 40, [0, 0, 0, 0.15]]]}
                flexDirection="row"
                group
                space={false}
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
})

export function HeadSection() {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const Fade = useFadePage({
    threshold: 0,
  })
  // const size = useScreenSize()

  return (
    <Fade.FadeProvide>
      <Col
        right={useScreenHeightVal(40, 0)}
        left={useScreenHeightVal(40, 0)}
        opacity={fontsLoaded ? 1 : 0}
        margin={['auto', 0]}
      >
        <Space size="xxxl" />
        <Col nodeRef={Fade.ref} margin={['auto', 0]} alignItems="center" justifyContent="center">
          <HeadContent />
        </Col>
        <Space size="xxxl" />
        <View flex={1} />
        <HeadJoin />
      </Col>
    </Fade.FadeProvide>
  )
}

// const SubSection = memo(({ title, children, index, titleColor }: any) => {
//   return (
//     <Col flex={1} minWidth={160} maxWidth={220}>
//       <FadeChild {...fadeUpProps} delay={200 + index * 200}>
//         <Paragraph
//           textAlign="center"
//           textTransform="uppercase"
//           alpha={0.65}
//           color={titleColor}
//           size={1}
//           fontWeight={600}
//         >
//           {title}
//         </Paragraph>
//         <Space size="sm" />
//         <SimpleText textAlign="center" selectable alpha={0.75} size={1} sizeLineHeight={1.1}>
//           {children}
//         </SimpleText>
//       </FadeChild>
//     </Col>
//   )
// })

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
//     flexDirection="row"
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
