import { Col, Icon, Image, Scale, SimpleTextProps, Space, SurfacePassProps, Tag, Theme, TitleProps, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { memo } from 'react'

import { fontProps } from '../../constants'
import { useScreenHeightVal } from '../../hooks/useScreenSize'
import { useSiteStore } from '../../SiteStore'
import { linkProps } from '../../useLink'
import { fadeAnimations, FadeInView, transitions, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContentChrome } from '../../views/SectionContent'
import { TitleText } from '../../views/TitleText'
import { Join } from './Join'
import { useScreenVal } from './SpacedPageContent'

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
        <Col
          flex={8}
          maxHeight="70vh"
          minHeight={750}
          sm-minHeight="auto"
          nodeRef={Fade.ref}
          alignItems="center"
          justifyContent="center"
        >
          <HeadContent />
        </Col>
        <Page.ParallaxView
          speed={-0.15}
          className="app-screenshot"
          position="relative"
          height={500}
          flex={7}
          margin={[0, '-10%']}
          userSelect="none"
        >
          <Page.ParallaxView
            speed={0.25}
            zIndex={100}
            position="absolute"
            left="50%"
            top={0}
            marginLeft={-70 / 2}
          >
            <View
              animate
              transformOrigin="center center"
              width={70}
              height={70}
              whileHover={{
                scale: 1.2,
              }}
              whileTap={{
                rotate: '360deg',
              }}
            >
              <FadeInView
                delayIndex={3}
                background={[255, 255, 255, 0.1]}
                borderRadius={100}
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
                pointerEvents="auto"
                cursor="pointer"
                transition="all ease 1s"
                hoverStyle={{
                  background: [255, 255, 255, 0.15],
                }}
              >
                <Icon size={24} color="#fff" name="play" />
              </FadeInView>
            </View>
          </Page.ParallaxView>
          <FadeInView {...fadeAnimations.up} delayIndex={4}>
            <Image
              display="block"
              src={require('../../public/images/screen.jpg')}
              width="100%"
              height="auto"
            />
          </FadeInView>
        </Page.ParallaxView>
      </Col>
    </Fade.FadeProvide>
  )
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
            <FadeInView delayIndex={10} disable={!measured} transition={transitions.bouncy}>
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
                iconAfter
                icon="chevron-right"
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
              {/* first line */}The home base for teams to build amazing internal tools.
            </TitleParagraph>
            &nbsp;
            <TitleParagraph {...para}>
              {/* second line */}
              Orbit is a head-up display for data&nbsp;&&nbsp;apps.
            </TitleParagraph>
            {br}
            <View position="relative" marginBottom={-95} marginTop={10}>
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

const TextFitTitle = (props: TitleProps) => {
  return (
    <TitleText userSelect="text" fontSize="12vw" lineHeight="8.5rem" lg-fontSize={135} {...props} />
  )
}

const TitleParagraph = (props: SimpleTextProps) => {
  return <Paragraph alpha={0.7} {...props} />
}
