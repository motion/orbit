import { Grid, Row, Space, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useState } from 'react'

import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'

const dly = 200

const sectionNames = ['Collaborate', 'App Kit', 'Publish']

const sections = {
  [sectionNames[0]]: [
    {
      title: 'Apps work together',
      icon: 'apps',
      body: [`Apps talk with simple typed APIs or GraphQL and Orbit has many data apps.`],
    },
    {
      title: `A space to collaborate`,
      icon: `satellite`,
      body: [`The easiest collaboration story. No servers to setup or credentials to share.`],
    },
    {
      title: `Stunning, easy apps`,
      icon: `shop`,
      body: [`A UI Kit with everything - designed to look good with few lines of code.`],
    },
    {
      title: `An interface for data`,
      icon: `widget`,
      body: [
        `A desktop-class UI kit with views that work well together and adapt to your data structures.`,
      ],
    },
  ],
  [sectionNames[1]]: [
    {
      title: 'The latest React, Typescript & Webpack',
      icon: 'tech',
      body: [
        `React Refresh hot reloading, with React Concurrent rendering out of the box. Plus, support for Suspense data-loading built into every library and view.`,
      ],
    },
    {
      title: `Next-gen Hot Reload`,
      icon: `refresh`,
      body: [
        `We've pushed Webpack to it's limit with a per-app instant-HMR that toggles between development and production in realtime.`,
      ],
    },
    {
      title: `Multi-process`,
      icon: `go`,
      body: [`Go off-thread with just a few lines of code, so you can keep your app fast.`],
    },
    {
      title: `Incredible Dev Tooling`,
      icon: `pen`,
      body: [
        `From logging to data management, state inspection, error recovery and more - Orbit comes with great DX.`,
      ],
    },
  ],
  [sectionNames[2]]: [
    {
      title: 'Query Builder',
      icon: 'query',
      body: [
        `Build and explore your data plugins, create queries and test them from the control panel.`,
      ],
    },
    {
      title: `GraphQL Explorer`,
      icon: `satellite`,
      body: [`Every app that exposes a GraphQL endpoint is explorable in the built-in explorer.`],
    },
    {
      title: `Manage/Sync Bits`,
      icon: `data`,
      body: [
        `The Bit is the universal data format for Orbit, and you view, search and manage them here.`,
      ],
    },
    {
      title: `Clipboard`,
      icon: `clipboard`,
      body: [`Make selections within tables or lists and easily move the data between apps.`],
    },
  ],
}

export default memo(() => {
  const Fade = useFadePage()
  const [activeSection, setActiveSection] = useState(sectionNames[0])
  const btnProps = (section: string) => {
    return {
      cursor: 'pointer',
      letterSpacing: 3,
      onClick: () => {
        setActiveSection(section)
      },
      borderWidth: 1,
      background: 'transparent',
      ...(activeSection !== section && {}),
      ...(activeSection === section && {
        background: '#11124A',
        borderColor: '#fff',
      }),
    } as const
  }
  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={0.3}
        zIndex={-1}
        opacity={0.45}
        x="-55%"
        scale={1.5}
        background="radial-gradient(circle closest-side, #8B1944, transparent)"
        parallaxAnimate={geometry => ({
          y: geometry.useParallax().transform(x => x + 500),
          x: geometry.useParallax().transform(x => -x),
        })}
      />

      <SpacedPageContent
        nodeRef={Fade.ref}
        height="auto"
        flex={1}
        margin="auto"
        header={
          <>
            <FadeInView delayIndex={0}>
              <PillButton>Features</PillButton>
            </FadeInView>
            <FadeInView delayIndex={1}>
              <TitleText textAlign="center" size="xl">
                Batteries Included
              </TitleText>
            </FadeInView>
            <FadeInView delayIndex={1} {...fadeAnimations.up}>
              <Row justifyContent="center" space="lg" margin={[15, 'auto', 0]}>
                {sectionNames.map(section => (
                  <React.Fragment key={section}>
                    <PillButtonDark {...btnProps(section)}>{section}</PillButtonDark>
                  </React.Fragment>
                ))}
              </Row>
            </FadeInView>
          </>
        }
      />

      <View flex={1} minHeight={80} />

      <FadeInView delayIndex={2} {...fadeAnimations.up}>
        <Grid space={80} alignItems="start" itemMinWidth={280} maxWidth={800} margin={[0, 'auto']}>
          {sections[activeSection].map(({ title, icon, body }, index) => (
            <SimpleSection key={`${activeSection}${index}`} delay={dly * (index + 1)} title={title}>
              <SectionP>
                <SectionIcon name={icon} />
                {flatMap(body, (x, i) => {
                  return (
                    <React.Fragment key={`${activeSection}${i}`}>
                      {+i === body.length - 1 ? (
                        x
                      ) : (
                        <>
                          {x}
                          <Space />
                        </>
                      )}
                    </React.Fragment>
                  )
                })}
              </SectionP>
            </SimpleSection>
          ))}
        </Grid>
      </FadeInView>

      <View flex={1} sm-flex={0} lg-flex={2} />

      <Space size="xl" />
    </Fade.FadeProvide>
  )
})
