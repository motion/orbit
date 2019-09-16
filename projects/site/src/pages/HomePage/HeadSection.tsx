import { Col, Image, Scale, SimpleTextProps, Space, SurfacePassProps, Tag, Theme, TitleProps, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { memo } from 'react'

import { fontProps } from '../../constants'
import { useScreenHeightVal } from '../../hooks/useScreenSize'
import { useSiteStore } from '../../SiteStore'
import { linkProps } from '../../useLink'
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

const scale = 0.75
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
  const sectionHeight = useSiteStore().sectionHeight

  return (
    <SectionContentChrome>
      <View
        className="head-text-section"
        minHeight={sectionHeight}
        textAlign="center"
        alignItems="center"
        justifyContent="center"
      >
        <View width="100%" alignItems="center">
          <TextFitTitle
            fontWeight={100}
            alignSelf="center"
            transformOrigin="top center"
            selectable
            textAlign="center"
            whiteSpace="nowrap"
            maxHeight={160}
          >
            <FadeInView delayIndex={10} disable={!measured}>
              <Tag
                size={0.85}
                sizeHeight={1.01}
                sizePadding={1.4}
                sizeRadius={4}
                alt="lightBlue"
                zIndex={1000}
                position="absolute"
                top={-60}
                right={-10}
                borderWidth={2}
                hoverStyle
                {...linkProps('/blog/update-two')}
              >
                Orbit enters private beta!
              </Tag>
            </FadeInView>
            <FadeInView disable={!measured}>Apps for teams</FadeInView>
          </TextFitTitle>

          {br}

          <View display="block" minHeight="min-content">
            <TitleParagraph {...para}>
              {/* first line */}A home base for teams to build internal tools together.
            </TitleParagraph>
            &nbsp;
            <TitleParagraph {...para}>
              {/* second line */}
              Orbit is a beautiful heads-up display for&nbsp;apps.
            </TitleParagraph>
            {br}
            <View position="relative" marginBottom={-90}>
              <HeadJoin />
            </View>
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
        <View flex={0.5} />
        <Col
          flex={6}
          maxHeight="70vh"
          nodeRef={Fade.ref}
          alignItems="center"
          justifyContent="center"
        >
          <HeadContent />
        </Col>
        <View
          className="app-screenshot"
          position="relative"
          height={500}
          flex={8}
          margin={[0, '-10%']}
        >
          <Image
            display="block"
            src={require('../../public/images/screen.jpg')}
            width="100%"
            height="auto"
          />
          {/* <FullScreen
            className="screen-image"
            backgroundImage={`url(${require('../../public/images/screen.jpg')})`}
            backgroundPosition="top center"
            backgroundSize="cover"

            minHeight={500}
          /> */}
        </View>
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
