import { FullScreen, Grid, Image, memoIsEqualDeep, Row, Space, View } from '@o/ui'
import React, { memo } from 'react'

import { mediaStyles } from '../../constants'
import orbits from '../../public/images/orbits.svg'
import { useSiteStore } from '../../SiteStore'
import { linkProps } from '../../useLink'
import { fadeAnimations, FadeChild, useFadePage } from '../../views/FadeInView'
import { MediaSmallHidden } from '../../views/MediaView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { apps } from './apps'
import { BodyButton } from './BodyButton'
import { blackWavePattern } from './purpleWaveUrl'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
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
        height={sectionHeight * 2}
        maxHeight={100000}
        margin={0}
        xs-margin={0}
        sm-margin={['-33%', 0, '10%']}
        height="auto"
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
          </>
        }
      >
        <Row
          className="hide-scrollbars"
          height="auto"
          space="md"
          spaceAround
          justifyContent="center"
          pointerEvents="none"
          transform={{
            y: '-70%',
          }}
        >
          {apps.map((app, index) => {
            let pivot = Math.round(apps.length / 2) - 1
            let offset = index * 20
            if (index >= pivot) {
              let i = index - pivot
              offset = pivot * 20 - i * 20
            }
            return (
              <Integration
                key={app.title}
                index={index}
                icon={app.icon}
                title={app.title}
                transform={{ y: `${offset}%` }}
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

      {/* Batteries Included. */}

      <Space size="sm" />
      <View flex={1} />

      <Fade.FadeProvide>
        <SpacedPageContent
          maxHeight={100000}
          height="auto"
          flex={1}
          margin="auto"
          header={
            <>
              <FadeChild delay={0}>
                <PillButton>App Kit</PillButton>
              </FadeChild>
              <FadeChild delay={100}>
                <TitleText
                  textAlign="center"
                  // TODO
                  size="xxl"
                  // size={useScreenVal('lg', 'xxxl', 'xxxl')}
                >
                  Batteries Included.
                </TitleText>
              </FadeChild>
              <TitleTextSub>
                <FadeChild delay={200}>
                  The vertically integrated workspace for work apps.
                </FadeChild>
              </TitleTextSub>
            </>
          }
        />

        <View flex={1} maxHeight={50} />

        <Grid
          nodeRef={Fade.ref}
          alignItems="start"
          space={30}
          itemMinWidth={280}
          maxWidth={800}
          margin={[0, 'auto']}
        >
          <SimpleSection delay={dly * 1} title="Apps work together.">
            <SectionP>
              <SectionIcon name="apps" />
              Apps talk to each other with simple typed APIs. Orbit comes with many data apps.
              <MediaSmallHidden>
                <Space />
                They can also sync data into a common format to display, share and export.
              </MediaSmallHidden>
            </SectionP>
          </SimpleSection>

          <SimpleSection delay={dly * 2} title="Spaces to collaborate.">
            <SectionP>
              <SectionIcon name="satellite" />
              The easiest collaboration story. No servers to setup or credentials to share.
              <MediaSmallHidden>
                <>
                  <Space />
                  Press edit and in seconds deploy a rich app to everyone.
                </>
              </MediaSmallHidden>
            </SectionP>
          </SimpleSection>

          <SimpleSection delay={dly * 3} title="Stunning, easy apps.">
            <SectionP>
              <SectionIcon name="shop" />A new platform designed from the ground up to make common
              apps easy to build, using modern TypeScript and an incredible build system designed
              for developer friendliness.
              <MediaSmallHidden>
                <>
                  <Space />
                  Publish in seconds on the app store.
                </>
              </MediaSmallHidden>
            </SectionP>
          </SimpleSection>

          <SimpleSection delay={dly * 4} title="Cross-platform, fast interface.">
            <SectionP>
              <SectionIcon name="widget" />A desktop-class UI kit with views that work together both
              in composition and shared prop types.
              <MediaSmallHidden>
                <>
                  <Space />
                  Layouts, templates, combining views and more.
                </>
              </MediaSmallHidden>
            </SectionP>
          </SimpleSection>
        </Grid>

        <View flex={1} sm-flex={0} lg-flex={2} />

        <Space size="xl" />
      </Fade.FadeProvide>
    </FadeDataApps.FadeProvide>
  )
})

const Integration = memoIsEqualDeep(({ icon, title, index, ...props }: any) => (
  <FadeChild
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
  </FadeChild>
))
