import { Col, Scale, Space, SurfacePassProps, Theme, TitleProps, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { memo } from 'react'

import { fontProps } from '../../constants'
import { useScreenHeightVal } from '../../hooks/useScreenSize'
import { fadeAnimations, FadeChild, useFadePage } from '../../views/FadeInView'
import { Paragraph } from '../../views/Paragraph'
import { SectionContentChrome } from '../../views/SectionContent'
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

const TextFitTitle = (props: TitleProps) => {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const titleFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  return <TitleText {...props} nodeRef={titleFit.ref} style={titleFit.style} />
}

// anything that influences width/size of text
const paragraphProps = {
  fontSize: 60,
  fontWeight: 400,
} as const

const HeadContent = memo(() => {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const measured = fontsLoaded
  const pFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const br = <View className="head-space" sm-height={100} height={50} lg-height={40} />

  return (
    <SectionContentChrome>
      <View
        className="head-text-section"
        position="absolute"
        left="5%"
        right="5%"
        top={0}
        bottom={0}
        textAlign="center"
        alignItems="center"
      >
        <View width="100%">
          <TextFitTitle
            fontWeight={100}
            alignSelf="center"
            transformOrigin="top center"
            selectable
            textAlign="center"
            whiteSpace="nowrap"
            maxHeight={160}
          >
            <FadeChild disable={!measured}>The Smart HUD</FadeChild>
          </TextFitTitle>

          {br}

          <View position="relative" flex={1} width="90%" maxWidth={800} margin={[0, 'auto']}>
            <Paragraph
              {...paragraphProps}
              tagName="div"
              height="auto"
              transformOrigin="top left"
              margin={[0, 'auto']}
              textAlign="center"
              alpha={0.7}
              lineHeight={pFit.isMeasured ? `${pFit.height}px` : `40px`}
              style={{
                ...pFit.style,
                height: 'auto',
              }}
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
              nodeRef={pFit.ref}
              {...paragraphProps}
              opacity={0}
              position="absolute"
              whiteSpace="pre"
              pointerEvents="none"
            >
              {texts[0]}
              <br />
              {texts[1]}
            </Paragraph>
          </View>
        </View>
      </View>
    </SectionContentChrome>
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

  return (
    <Fade.FadeProvide>
      <Col
        right={useScreenHeightVal(40, 0)}
        left={useScreenHeightVal(40, 0)}
        opacity={fontsLoaded ? 1 : 0}
        margin={['auto', 0]}
        height="calc(100% - 120px)"
      >
        <Space size="xxl" />
        <View flex={1.5} />
        <Col flex={6} nodeRef={Fade.ref} alignItems="center" justifyContent="center">
          <HeadContent />
        </Col>
        <View flex={1} />
        <Space size="xxl" />
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
