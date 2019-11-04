import { gloss, Icon, Image, Parallax, SimpleText, SimpleTextProps, Space, Stack, SurfacePassProps, Theme, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import { Flex } from 'gloss'
import React, { memo } from 'react'

import { fontProps } from '../../constants'
import { useSiteStore } from '../../SiteStore'
import { fadeAnimations, FadeChildProps, FadeInView, transitions, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContentChrome } from '../../views/SectionContent'
import { Join } from './Join'
import { WelcomeBlogPostButton } from './WelcomeBlogPostButton'

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

const Star = gloss(Flex, {
  borderRadius: 100,
  width: 2,
  height: 2,
  background: 'rgba(255,255,255,0.8)',
  position: 'absolute',
  boxShadow: [
    {
      spread: 10,
      blur: 10,
      color: 'rgba(255,255,255,0.1)',
      x: 0,
      y: 0,
    },
  ],
})

export function HeadSection() {
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const Fade = useFadePage({
    threshold: 0,
  })

  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={-0.35}
        offset={-1}
        zIndex={-1}
        opacity={0.3}
        scale={1.5}
        top="-70%"
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      />

      {/* <Page.ParallaxView
        className="stars"
        speed={1}
        position="absolute"
        width="50%"
        height="50%"
        top="0%"
        right="-80%"
        parallax={geometry => ({
          x: geometry.useParallax().transform(x => -x * 3),
          y: geometry.useParallax().transform(x => x * 3),
        })}
      >
        <Star top="0%" left="0%" />
        <Star top="20%" left="20%" />
        <Star top="50%" left="80%" />
        <Star top="0%" left="30%" />
        <Star top="0%" left="80%" />
      </Page.ParallaxView>

      <Page.ParallaxView
        className="stars"
        speed={1}
        position="absolute"
        width="50%"
        height="50%"
        top="0%"
        right="-80%"
        parallax={geometry => ({
          x: geometry.useParallax().transform(x => -x * 3 * 1.2),
          y: geometry.useParallax().transform(x => x * 3 * 1.2),
        })}
      >
        <Star top="0%" left="0%" />
        <Star top="20%" left="20%" />
        <Star top="50%" left="80%" />
        <Star top="0%" left="30%" />
        <Star top="0%" left="80%" />
      </Page.ParallaxView> */}

      <Stack opacity={fontsLoaded ? 1 : 0} margin={['auto', 0]} height="calc(100% - 120px)">
        <Space size="xxl" />
        <Stack
          maxHeight="80vh"
          minHeight={600}
          sm-minHeight="auto"
          nodeRef={Fade.ref}
          alignItems="center"
          justifyContent="center"
        >
          <HeadTextSection />
        </Stack>
        <View
          className="app-screenshot"
          position="relative"
          height={500}
          flex={7}
          margin={['-20%', '-10%', -100]}
          userSelect="none"
          zIndex={-1}
        >
          <Parallax.View speed={-0.1}>
            <FadeInView speed={1} {...animation.screen}>
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
          </Parallax.View>
        </View>
      </Stack>
      <View
        zIndex={100}
        position="absolute"
        left="50%"
        top="50%"
        marginTop={180}
        marginLeft={`${-180 / 2}px`}
        width={180}
        alignItems="center"
        justifyContent="center"
      >
        <Parallax.View speed={0.1} alignItems="inherit" justifyContent="inherit">
          <FadeInView
            speed={-0.1}
            {...animation.watch}
            flex={1}
            alignItems="inherit"
            justifyContent="inherit"
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
        </Parallax.View>
      </View>
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
  fontWeight: 300,
  'abovemd-fontWeight': 300,
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
              <WelcomeBlogPostButton />
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
          <View
            display="block"
            minHeight="min-content"
            sm-display="inline"
            marginTop={10}
            position="relative"
          >
            <HeadJoin />
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
            <Theme scale={1.2} sm-scale={1}>
              <Join
                inputProps={{
                  minWidth: 300,
                  'sm-minWidth': 'auto',
                  textAlign: 'left',
                }}
                borderRadius={1000}
                boxShadow={[[0, 5, 40, [0, 0, 0, 0.15]]]}
                flexDirection="row"
                group
                space={false}
              />
            </Theme>
          </Theme>
        </SurfacePassProps>
      </FadeInView>
    </View>
  )
})

const titleSize = 9

const TextFitTitle = gloss(SimpleText, {
  userSelect: 'text',
  lineHeight: '95%',
  fontSize: `${titleSize}vw`,
  'lg-fontSize': titleSize * 11.5,
})

const TitleParagraph = (props: SimpleTextProps) => {
  return <Paragraph alpha={0.7} xs-display="inline" {...props} />
}
