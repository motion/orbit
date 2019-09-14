import { Col, FullScreen, Scale, SimpleTextProps, Space, SurfacePassProps, Theme, TitleProps, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { memo } from 'react'

import { fontProps } from '../../constants'
import { useScreenHeightVal } from '../../hooks/useScreenSize'
import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Paragraph } from '../../views/Paragraph'
import { SectionContentChrome } from '../../views/SectionContent'
import { TitleText } from '../../views/TitleText'
import { Join } from './Join'
import { useScreenVal } from './SpacedPageContent'

const TextFitTitle = (props: TitleProps) => {
  return (
    <TitleText userSelect="text" fontSize="12vw" lineHeight="8.5rem" lg-fontSize={135} {...props} />
  )
}

const TitleParagraph = (props: SimpleTextProps) => {
  return <Paragraph alpha={0.7} {...props} />
}

const scale = 0.8
const para = {
  display: 'flex',
  fontSize: `${3.4 * scale}vw`,
  lineHeight: `${5 * scale}vw`,
  'lg-fontSize': 38 * scale,
  'lg-lineHeight': `${3 * scale}rem`,
  'sm-fontSize': 22 * scale,
  'sm-lineHeight': `${2.8 * scale}rem`,
  'sm-display': 'inline',
} as const

const HeadContent = memo(() => {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const measured = fontsLoaded
  // const pFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const br = <View className="head-space" height="3.5vh" maxHeight={70} />

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
        justifyContent="center"
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
            <FadeInView disable={!measured}>Apps for teams</FadeInView>
          </TextFitTitle>

          {br}

          <View display="block" minHeight="min-content">
            <TitleParagraph {...para}>
              {/* first line */}
              Build a suite of internal tools in no time.
            </TitleParagraph>
            &nbsp;
            <TitleParagraph {...para}>
              {/* second line */}
              Orbit is an easy, all-in-one platform for your&nbsp;intranet.
            </TitleParagraph>
          </View>
        </View>
      </View>
    </SectionContentChrome>
  )
})

const HeadJoin = memo(() => {
  return (
    <View flex={1} width="100%" alignItems="center">
      <FadeInView {...fadeAnimations.up} delay={500}>
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
      </FadeInView>
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

  console.log(require('../../public/images/screen.jpg'))

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
        <View flex={0.5} />
        <Col flex={6} nodeRef={Fade.ref} alignItems="center" justifyContent="center">
          <HeadContent />
        </Col>
        <HeadJoin />
        <View position="relative" height={500} flex={8} minWidth={1200} margin={[0, '-10%']}>
          <FullScreen
            backgroundImage={`url(${require('../../public/images/screen.jpg')})`}
            backgroundPosition="top center"
            backgroundSize="cover"
          />
        </View>
      </Col>
    </Fade.FadeProvide>
  )
}

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
//     <FadeInView delay={1000}>
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
//     </FadeInView>
//   )
// }
