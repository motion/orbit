import { Col, Icon, Image, Scale, SimpleText, SimpleTextProps, Space, SurfacePassProps, Tag, Theme, TitleProps, View } from '@o/ui'
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
      {/* <Page.BackgroundParallax
        speed={0.35}
        zIndex={1}
        opacity={0.2}
        offset={1.1}
        x="5%"
        scale={1.5}
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      /> */}

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
          <FadeInView {...fadeAnimations.up} delayIndex={4} marginBottom="-10%">
            <Image
              display="block"
              src={require('../../public/images/screen.jpg')}
              width="100%"
              maxWidth={1200}
              margin="auto"
              height="auto"
            />
          </FadeInView>
        </Page.ParallaxView>
      </Col>
      <Page.ParallaxView
        speed={0.1}
        offset={0.82}
        zIndex={100}
        position="absolute"
        left="50%"
        top={0}
        marginLeft={-80 / 2}
        alignItems="center"
        justifyContent="center"
      >
        <View
          animate
          transformOrigin="center center"
          width={80}
          height={80}
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
            <Icon size={28} color="#fff" name="play" />
          </FadeInView>
        </View>
        <Space />
        <View
          padding={[3, 8]}
          background={[255, 255, 255, 0.1]}
          borderRadius={100}
          border={[2, '#00000055']}
        >
          <SimpleText>Watch the demo</SimpleText>
        </View>
      </Page.ParallaxView>
    </Fade.FadeProvide>
  )
}

const scale = 0.8
const para = {
  display: 'flex',
  fontSize: `${3.4 * scale}vw`,
  lineHeight: `${5.1 * scale}vw`,
  'lg-fontSize': 38 * scale,
  'lg-lineHeight': `${3.2 * scale}rem`,
  'sm-fontSize': 22 * scale,
  'sm-lineHeight': `${2.8 * scale}rem`,
  'sm-display': 'inline',
  fontWeight: 400,
  'notmd-fontWeight': 300,
} as const

const HeadContent = memo(() => {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const measured = fontsLoaded
  // const pFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const br = <View className="head-space" height={20} sm-height={15} />
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
                // safari ellipse bugfix...
                minWidth={205}
                {...linkProps('/blog/update-two')}
              >
                Orbit enters private beta!
              </Tag>
            </FadeInView>
            <FadeInView disable={!measured} delayIndex={2} {...fontProps.TitleFont}>
              Apps for teams
            </FadeInView>
          </TextFitTitle>

          {br}

          <FadeInView
            // transition={transitions.bouncy}
            delayIndex={3}
            display="block"
            minHeight="min-content"
          >
            <TitleParagraph {...para}>
              {/* first line */}A home base for teams to create internal tools with ease.
            </TitleParagraph>
            &nbsp;
            <TitleParagraph {...para}>
              {/* second line */}
              Orbit is a heads-up display for data&nbsp;&&nbsp;apps.
            </TitleParagraph>
            {br}
            <View position="relative" marginBottom={-95} marginTop={10}>
              <HeadJoin />
            </View>
          </FadeInView>
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
    <TitleText
      userSelect="text"
      fontSize="12vw"
      lineHeight="90%"
      notsm-lineHeight={135}
      lg-fontSize={135}
      {...props}
    />
  )
}

const TitleParagraph = (props: SimpleTextProps) => {
  return <Paragraph alpha={0.7} {...props} />
}
