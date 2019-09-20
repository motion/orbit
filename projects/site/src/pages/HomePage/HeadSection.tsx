import { Col, Icon, Image, Scale, SimpleText, SimpleTextProps, Space, SurfacePassProps, Tag, Theme, TitleProps, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import React, { memo } from 'react'

import { fontProps } from '../../constants'
import { useSiteStore } from '../../SiteStore'
import { linkProps } from '../../useLink'
import { fadeAnimations, FadeChildProps, FadeInView, transitions, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContentChrome } from '../../views/SectionContent'
import { TitleText } from '../../views/TitleText'
import { Join } from './Join'
import { useScreenVal } from './SpacedPageContent'

const allDelay = 2

const animation: {
  [key: string]: FadeChildProps
} = {
  title: {
    delayIndex: allDelay + 0,
  },
  sub1: {
    delayIndex: allDelay + 1,
    ...fadeAnimations.up,
  },
  sub2: {
    delayIndex: allDelay + 2,
    ...fadeAnimations.up,
  },
  join: {
    delayIndex: allDelay + 3,
    ...fadeAnimations.up,
  },
  watch: {
    delayIndex: allDelay + 4,
    ...fadeAnimations.up,
  },
  screen: {
    delayIndex: allDelay + 5,
    ...fadeAnimations.up,
    transition: transitions.slowBouncy,
  },
  blog: {
    delayIndex: allDelay + 16,
    transition: transitions.bouncy,
  },
}

export function HeadSection() {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const Fade = useFadePage({
    threshold: 0,
  })

  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={-0.35}
        offset={-0.9}
        zIndex={-1}
        opacity={0.4}
        scale={1.5}
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      />

      {/* <Page.ParallaxView
        className="floating-cube"
        width={120}
        position="absolute"
        offset={0.5}
        zIndex={10000}
        parallaxAnimate={geometry => ({
          y: geometry.useParallax(),
          x: geometry.useParallax().transform(x => -x * 0.5 + 340),
        })}
      >
        <Image src={require('../../public/images/test.png')} width="100%" height="auto" />
      </Page.ParallaxView> */}

      <Col opacity={fontsLoaded ? 1 : 0} margin={['auto', 0]} height="calc(100% - 120px)">
        <Space size="xxl" />
        <Col
          flex={8}
          maxHeight="80vh"
          minHeight={750}
          sm-minHeight="auto"
          nodeRef={Fade.ref}
          alignItems="center"
          justifyContent="center"
        >
          <HeadTextSection />
        </Col>
        <Page.ParallaxView
          speed={-0.05}
          offset={0}
          className="app-screenshot"
          position="relative"
          height={500}
          flex={7}
          margin={['-15%', '-10%', 90]}
          userSelect="none"
          zIndex={-1}
        >
          <FadeInView {...animation.screen}>
            <View
              transform={{
                perspective: 10000,
                rotateY: '15deg',
                rotateX: '58deg',
                rotateZ: '-22deg',
              }}
            >
              <Image
                display="block"
                src={require('../../public/images/screen.jpg')}
                width="auto"
                height={500}
                maxWidth={1200}
                margin="auto"
              />
            </View>
          </FadeInView>
        </Page.ParallaxView>
      </Col>
      <Page.ParallaxView
        speed={0.1}
        offset={0.5}
        zIndex={100}
        position="absolute"
        left="50%"
        top="15vh"
        marginLeft={`${-180 / 2}px`}
        width={180}
        alignItems="center"
        justifyContent="center"
      >
        <FadeInView {...animation.watch} flex={1} alignItems="inherit" justifyContent="inherit">
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
            sm-transform={{
              scale: 0.8,
            }}
          >
            <View
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
            </View>
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
        </FadeInView>
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

const HeadTextSection = memo(() => {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const measured = fontsLoaded
  // const pFit = useTextFit({ min: 16, updateKey: fontsLoaded })
  const br = <View className="head-space" height={30} sm-height={15} />
  const sectionHeight = useSiteStore().sectionHeight

  return (
    <SectionContentChrome>
      <View
        className="head-text-section"
        minHeight={sectionHeight}
        textAlign="center"
        alignItems="center"
        justifyContent="center"
        zIndex={10}
        position="relative"
        marginTop="5vh"
      >
        <View width="100%" alignItems="center">
          <TextFitTitle
            fontWeight={100}
            alignSelf="center"
            selectable
            textAlign="center"
            whiteSpace="nowrap"
            maxHeight={160}
          >
            <FadeInView {...animation.blog} disable={!measured}>
              <Tag
                size={0.85}
                sizeHeight={1.01}
                sizePadding={1.4}
                sizeRadius={4}
                coat="lightBlue"
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
            <FadeInView disable={!measured} {...animation.title} {...fontProps.TitleFont}>
              Amazing internal tools
            </FadeInView>
          </TextFitTitle>
          {br}
          <FadeInView {...animation.sub1} minHeight="min-content">
            <TitleParagraph {...para}>
              {/* first line */}Create internal tools you'd never have attempted before.
            </TitleParagraph>
          </FadeInView>
          <span style={{ userSelect: 'none' }}>&nbsp;</span>
          <View sm-display="none">
            <FadeInView {...animation.sub2} minHeight="min-content">
              <TitleParagraph {...para}>
                {/* second line */}
                The all-in-one data & app studio for teams.
              </TitleParagraph>
            </FadeInView>
          </View>
          {br}
          <FadeInView
            {...animation.join}
            display="block"
            minHeight="min-content"
            sm-display="inline"
            marginTop={10}
            position="relative"
          >
            <HeadJoin />
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
            <Scale size={useScreenVal(1, 1.1, 1.2)}>
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

const titleSize = 9

const TextFitTitle = (props: TitleProps) => {
  return (
    <TitleText
      userSelect="text"
      // @ts-ignore
      lineHeight="95%"
      fontSize={`${titleSize}vw`}
      lg-fontSize={titleSize * 11.5}
      {...props}
    />
  )
}

const TitleParagraph = (props: SimpleTextProps) => {
  return <Paragraph alpha={0.7} xs-display="inline" {...props} />
}
