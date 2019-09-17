import { FullScreen, Image, memoIsEqualDeep, Row, Space, View } from '@o/ui'
import React, { memo } from 'react'

import { mediaStyles } from '../../constants'
import orbits from '../../public/images/orbits.svg'
import { linkProps } from '../../useLink'
import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { apps } from './apps'
import { BodyButton } from './BodyButton'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default memo(() => {
  const FadeDataApps = useFadePage({ threshold: 0 })
  return (
    <FadeDataApps.FadeProvide>
      {/* dark red bottom right */}
      {/* <Page.BackgroundParallax
        speed={0.5}
        zIndex={-2}
        opacity={0.8}
        offset={1.1}
        x="5%"
        scale={1.5}
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      /> */}

      <Page.BackgroundParallax
        {...mediaStyles.hiddenWhen.sm}
        speed={-0.05}
        offset={0}
        zIndex={-2}
        scale={0.5}
        transformOrigin="bottom center"
      >
        <FadeInView delay={800} height="90%" width="100%">
          <FullScreen
            left={-100}
            right={-100}
            maxHeight={450}
            className="orbitals"
            backgroundImage={`url(${orbits})`}
            backgroundPosition="top center"
            backgroundRepeat="no-repeat"
          />
        </FadeInView>
      </Page.BackgroundParallax>

      <SpacedPageContent
        nodeRef={FadeDataApps.ref}
        height="auto"
        maxHeight={100000}
        margin={0}
        padding={['18vh', 0]}
        xs-margin={0}
        header={
          <>
            <FadeInView>
              <PillButton>App Store</PillButton>
            </FadeInView>
            <FadeInView delay={100}>
              <TitleText textAlign="center" size="xxl">
                Global collaboration.
              </TitleText>
            </FadeInView>
            <TitleTextSub>
              <FadeInView delay={200}>
                An open app store with more - every app can sync data, expose GraphQL and TypeScript
                APIs, and render content.
              </FadeInView>
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

        <FadeInView delay={0}>
          <Row space margin={[0, 'auto']}>
            <BodyButton {...linkProps('/apps')} size="lg">
              Explore apps
            </BodyButton>
          </Row>
        </FadeInView>
      </SpacedPageContent>
    </FadeDataApps.FadeProvide>
  )
})

const Integration = memoIsEqualDeep(({ icon, title, index, ...props }: any) => {
  return (
    <FadeInView
      {...(index % 1 == 0 ? fadeAnimations.left : fadeAnimations.right)}
      delay={index * 50 + 100}
    >
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
    </FadeInView>
  )
})
