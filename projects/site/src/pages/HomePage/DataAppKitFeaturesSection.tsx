import { FullScreen, Image, memoIsEqualDeep, ParallaxView, Row, Space, View } from '@o/ui'
import React, { memo } from 'react'

import { mediaStyles } from '../../constants'
import orbits from '../../public/images/orbits.svg'
import { useSiteStore } from '../../SiteStore'
import { linkProps } from '../../useLink'
import { fadeAnimations, FadeChild, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { apps } from './apps'
import { BodyButton } from './BodyButton'
import { blackWavePattern } from './purpleWaveUrl'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

const dly = 200

export default memo(() => {
  const { sectionHeight } = useSiteStore()
  const FadeDataApps = useFadePage({ threshold: 0 })
  const Fade = useFadePage()
  return (
    <FadeDataApps.FadeProvide>
      <Page.BackgroundParallax
        speed={0.1}
        offset={0}
        zIndex={-20}
        backgroundSize="cover"
        left="-20%"
        right="-20%"
        bottom="-50%"
        backgroundColor="transparent"
        backgroundPosition="top center"
        opacity={0.4}
        backgroundImage={blackWavePattern}
      />

      {/* dark red bottom right */}
      <Page.BackgroundParallax
        speed={0.35}
        zIndex={-2}
        opacity={0.3}
        offset={1.1}
        x="5%"
        scale={1.5}
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      />

      <Page.BackgroundParallax
        {...mediaStyles.hiddenWhen.sm}
        speed={-0.05}
        zIndex={-2}
        offset={-0.1}
        scale={0.5}
        transformOrigin="bottom center"
      >
        <FadeChild delay={800} height="100%" width="100%">
          <FullScreen
            left={-100}
            right={-100}
            maxHeight={450}
            className="orbitals"
            backgroundImage={`url(${orbits})`}
            backgroundPosition="top center"
            backgroundRepeat="no-repeat"
          />
        </FadeChild>
      </Page.BackgroundParallax>

      <SpacedPageContent
        nodeRef={FadeDataApps.ref}
        height="auto"
        maxHeight={100000}
        margin={0}
        xs-margin={0}
        sm-margin={['-33%', 0, '10%']}
        header={
          <>
            <FadeChild>
              <PillButton>App Store</PillButton>
            </FadeChild>
            <FadeChild delay={100}>
              <TitleText textAlign="center" size="xxl">
                The app store with more.
              </TitleText>
            </FadeChild>
            <TitleTextSub>
              <FadeChild delay={200}>
                The app store with more - every app can sync in data, expose GraphQL and TypeScript
                APIs, and render content.
              </FadeChild>
            </TitleTextSub>
            <Space size="xl" />
          </>
        }
      >
        <Row
          className="hide-scrollbars"
          height="auto"
          space="md"
          padding={['lg', false]}
          spaceAround
          justifyContent="center"
          pointerEvents="none"
          transform={{
            y: '-80%',
          }}
        >
          {apps.map((app, index) => {
            let pivot = Math.round(apps.length / 2) - 1
            let offset = index * 40
            if (index >= pivot) {
              let i = index - pivot
              offset = pivot * 40 - i * 40
            }
            return (
              <Integration
                key={app.title}
                index={index}
                icon={app.icon}
                title={app.title}
                transform={{ y: `${offset}px` }}
              />
            )
          })}
        </Row>

        <Space size="lg" />

        <FadeChild delay={0}>
          <Row space margin={[0, 'auto']}>
            <BodyButton {...linkProps('/apps')} size="lg">
              Explore apps
            </BodyButton>
          </Row>
        </FadeChild>
      </SpacedPageContent>
    </FadeDataApps.FadeProvide>
  )
})

const Integration = memoIsEqualDeep(({ icon, title, index, ...props }: any) => {
  return (
    <FadeChild
      {...(index % 1 == 0 ? fadeAnimations.left : fadeAnimations.right)}
      delay={index * 50 + 100}
    >
      {/* TODO */}
      <ParallaxView speed={0} offset={0}>
        <View
          userSelect="none"
          height={150}
          width={150}
          alignItems="center"
          justifyContent="center"
          {...props}
        >
          <Image
            src={icon}
            transition="all ease 200ms"
            maxWidth={56}
            width="50%"
            height="auto"
            hoverStyle={{ opacity: 1 }}
          />
          <Space />
          <Paragraph selectable={false} size="sm">
            {title}
          </Paragraph>
        </View>
      </ParallaxView>
    </FadeChild>
  )
})
