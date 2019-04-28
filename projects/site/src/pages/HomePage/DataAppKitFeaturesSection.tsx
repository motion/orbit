import { FullScreen, Grid, Image, memoIsEqualDeep, PassProps, Row, Space, View } from '@o/ui'
import React, { memo } from 'react'

import orbits from '../../../public/images/orbits.svg'
import { useScreenHeight, useScreenSize } from '../../hooks/useScreenSize'
import { useSiteStore } from '../../SiteStore'
import { FadeChild, fadeLeftProps, useFadePage } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { apps } from './apps'
import { BodyButton } from './BodyButton'
import { blackWavePattern } from './FooterSection'
import { GradientDown } from './GradientDown'
import { linkProps } from './linkProps'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'

const dly = 200

export default memo(function DataAppKitFeaturesSection(props: any) {
  const screen = useScreenSize()
  const height = useScreenHeight()
  const { sectionHeight } = useSiteStore()
  const FadeDataApps = useFadePage({ threshold: 0 })
  const Fade = useFadePage()
  return (
    <>
      <FadeDataApps.FadeProvide>
        {/* Data, meet app */}

        {screen !== 'small' && (
          <Page.Parallax speed={-0.05} zIndex={-2}>
            <FullScreen transform={{ y: '-80%', scale: 0.65 }} transformOrigin="bottom center">
              <FadeChild delay={300} style={{ width: '100%', height: '100%' }}>
                <FullScreen
                  left={-100}
                  right={-100}
                  top="auto"
                  height="50%"
                  className="orbitals"
                  backgroundImage={`url(${orbits})`}
                  backgroundPosition="top center"
                  backgroundRepeat="no-repeat"
                />
              </FadeChild>
              <GradientDown left={-100} right={-100} top="auto" height="50%" />
            </FullScreen>
          </Page.Parallax>
        )}

        <Page.Content ref={FadeDataApps.ref} height={sectionHeight * 2} flex={1}>
          <SpacedPageContent
            maxHeight={100000}
            margin={screen === 'small' ? ['-50%', 0, '10%'] : [0, 0, '6%']}
            height="auto"
            header={
              <>
                <FadeChild delay={100}>
                  <TitleText textAlign="center" size="xxl">
                    Bring your data together.
                  </TitleText>
                </FadeChild>
                <TitleTextSub size="sm">
                  <FadeChild delay={200}>
                    Plug in many integrations, then build on them.
                    {screen !== 'small' && <br />}
                    &nbsp;Use, extend and publish more in the open app store.
                  </FadeChild>
                </TitleTextSub>
              </>
            }
          >
            <Row
              className="hide-scrollbars"
              margin="0 -10vw"
              width="100vw"
              height="auto"
              space="md"
              spaceAround
              justifyContent="center"
              transform={{
                y: '-60%',
              }}
            >
              {apps.map((app, index) => (
                <Integration
                  key={app.title}
                  index={index}
                  icon={app.icon}
                  title={app.title}
                  transform={{ y: `${index * 20}%` }}
                />
              ))}
            </Row>

            <Space />

            <FadeChild delay={0}>
              <Row space margin={[0, 'auto']}>
                <BodyButton {...linkProps('/apps')} size={2}>
                  Explore apps
                </BodyButton>
              </Row>
            </FadeChild>
          </SpacedPageContent>

          {/* Batteries Included. */}

          <Space size="sm" />

          <Fade.FadeProvide>
            <SpacedPageContent
              ref={Fade.ref}
              maxHeight={100000}
              height="auto"
              flex={1}
              margin={[0, 'auto']}
              header={
                <>
                  <FadeChild delay={0}>
                    <PillButton>App Kit</PillButton>
                  </FadeChild>
                  <FadeChild delay={100}>
                    <TitleText size={useScreenVal('lg', 'xl', 'xxl')}>
                      Batteries Included.
                    </TitleText>
                  </FadeChild>
                  <TitleTextSub>
                    <FadeChild delay={200}>
                      Internal tools share patterns. Orbit makes building those types of apps easy.
                    </FadeChild>
                  </TitleTextSub>
                </>
              }
            >
              <Space size="sm" />
              <Grid
                alignItems="start"
                space={screen === 'small' ? '40px 15%' : '20% 15%'}
                itemMinWidth={240}
                maxWidth={800}
                margin="auto"
              >
                <PassProps
                  getChildProps={(_, index) => ({
                    index: screen === 'small' ? undefined : index + 1,
                    ...(screen !== 'small' && index % 2 === 1 && { transform: { y: '70%' } }),
                  })}
                >
                  <SimpleSection delay={dly * 1} title="Apps work together.">
                    <SectionP>
                      <SectionIcon name="apps" />
                      Apps talk to each other with simple typed APIs. Orbit comes with many data
                      apps.
                      {screen !== 'small' && (
                        <>
                          <Space />
                          They can also sync data into a common format to display, share and export.
                        </>
                      )}
                    </SectionP>
                  </SimpleSection>

                  <SimpleSection delay={dly * 2} title="Spaces to collaborate.">
                    <SectionP>
                      <SectionIcon name="satellite" />
                      The easiest collaboration story. No credential sharing, everyone in sync.
                      {screen !== 'small' && (
                        <>
                          <Space />
                          Press edit and in seconds deploy a rich app to everyone.
                        </>
                      )}
                    </SectionP>
                  </SimpleSection>

                  <SimpleSection delay={dly * 3} title="Multi-process apps.">
                    <SectionP>
                      <SectionIcon name="shop" />
                      Apps are written using React and Typescript and publish like node modules.
                      They support many features, like sharing data and APIs.
                      {screen !== 'small' && (
                        <>
                          <Space />
                          When you're ready, publish it in seconds on the app store.
                        </>
                      )}
                    </SectionP>
                  </SimpleSection>

                  <SimpleSection delay={dly * 4} title="Native-level UI Kit.">
                    <SectionP>
                      <SectionIcon name="widget" />
                      Orbit is building a desktop-class UI kit, and going further by making many
                      views work together both in composition and shared prop types.
                      {screen !== 'small' && (
                        <>
                          <Space />
                          Layouts, templates, combining views and more.
                        </>
                      )}
                    </SectionP>
                  </SimpleSection>
                </PassProps>
              </Grid>

              <View flex={3} />

              {screen === 'large' && height !== 'short' && (
                <>
                  <Space size="xxl" />
                  <BodyButton {...linkProps('/docs')} margin={[0, 'auto']} size="xl">
                    Read the feature overview
                  </BodyButton>
                </>
              )}
            </SpacedPageContent>
          </Fade.FadeProvide>
        </Page.Content>
      </FadeDataApps.FadeProvide>

      <Page.Background
        speed={0.1}
        zIndex={-20}
        bottom="-150%"
        backgroundSize="cover"
        left="-40%"
        right="-40%"
        width="180%"
        top="-10%"
        backgroundColor="transparent"
        backgroundPosition="top center"
        opacity={1}
        backgroundImage={blackWavePattern}
      />
    </>
  )
})

const Integration = memoIsEqualDeep(({ icon, title, index, ...props }: any) => (
  <FadeChild {...fadeLeftProps} delay={index * 50 + 100}>
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
        maxWidth={100}
        width="50%"
        height="auto"
        hoverStyle={{ opacity: 1 }}
      />
      <Space />
      <Paragraph selectable={false} size="xl">
        {title}
      </Paragraph>
    </View>
  </FadeChild>
))
