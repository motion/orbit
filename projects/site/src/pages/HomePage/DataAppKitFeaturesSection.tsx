import { FullScreen, Image, memoIsEqualDeep, Row, Space, View } from '@o/ui'
import React, { memo } from 'react'

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
      {/* deep purple right */}
      <Page.BackgroundParallax
        offset={-0.3}
        speed={0.45}
        zIndex={-2}
        opacity={0.3}
        x="50%"
        scale={1.9}
        background="radial-gradient(circle closest-side, #7523AD, transparent)"
      />

      <Page.BackgroundParallax
        speed={-0.05}
        offset={0}
        zIndex={-2}
        scale={0.5}
        transformOrigin="bottom center"
        top={-20}
        // keeps it from cropping on small screen
        left="-40%"
        right="-40%"
      >
        <FadeInView delay={800} height="90%" width="100%">
          <FullScreen
            left={-120}
            right={-120}
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
              <TitleText textAlign="center" size="lg">
                An app store for all
              </TitleText>
            </FadeInView>
            <TitleTextSub>
              <FadeInView delay={200}>
                Apps can sync data, use GraphQL and TypeScript APIs and render content.
                They're&nbsp;everything you need to build upwards.
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
