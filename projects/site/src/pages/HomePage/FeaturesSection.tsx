import { Col, Grid, Image, Row, Space, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useState } from 'react'

import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'

const dly = 200

const sectionNames = ['Integrate', 'Display', 'Build']

const sections = {
  [sectionNames[0]]: [
    {
      title: `One-click data sources`,
      icon: `data`,
      body: [`Every app can provide data APIs, installs with a simple search + click.`],
    },
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
  ],
  [sectionNames[1]]: [
    {
      title: 'Performant, Complete UI Kit',
      icon: 'interface',
      body: [
        `All lists and tables virtualized. React Concurrent rendering. Flexible, consistent data display across all views.`,
      ],
    },
    {
      title: `Drag & Drop Data`,
      icon: `clopboard`,
      body: [
        `First class data drag/drop. Move data into Orbit or out of it with a drag, or between apps with the Clipboard applet.`,
      ],
    },
    {
      title: `Stunning, easy apps`,
      icon: `shop`,
      body: [`A UI Kit with everything you need.`],
    },
    {
      title: `Clipboard`,
      icon: `clipboard`,
      body: [`Make selections within tables or lists and easily move the data between apps.`],
    },
  ],
  [sectionNames[2]]: [
    {
      title: `A space to collaborate`,
      icon: `satellite`,
      body: [`The easiest collaboration story: no servers, no credentials.`],
    },
    {
      title: `Next-gen Hot Reload`,
      icon: `refresh`,
      body: [
        `A custom per-app Webpack with instant React Refresh hot reloading. Toggle between development and production in realtime.`,
      ],
    },
    {
      title: `Amazing technology`,
      icon: `go`,
      body: [
        `Add a node process with a few lines of code. React Concurrent and Suspense first-class support.`,
      ],
    },
    {
      title: `Incredible Dev Tooling`,
      icon: `pen`,
      body: [
        `From logging to data management, state inspection, error recovery and more - Orbit comes with great DX.`,
      ],
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
      {/* teal right */}
      <Page.BackgroundParallax
        speed={0.3}
        offset={0}
        top="-20%"
        bottom="-20%"
        x="60%"
        scale={1.3}
        className="glow-two"
        opacity={0.4}
        background="radial-gradient(circle closest-side, #12A1CC, transparent)"
        parallaxAnimate={geometry => ({
          y: geometry.useParallax(),
          x: geometry.useParallax().transform(x => -x * 1 + 240),
        })}
      />

      <Row nodeRef={Fade.ref} margin={[0, 'auto']} padding={['8vh', 0, '8vh']}>
        <Col padding="lg" flex={2}>
          <View flex={1}>
            <FadeInView delayIndex={1}>
              <TitleText alignItems="flex-start" justifyContent="flex-start" size="xxl">
                The all-in-one
                <br />
                data studio
              </TitleText>
            </FadeInView>
            <FadeInView delayIndex={1} {...fadeAnimations.up}>
              <Row space="lg" margin={['4%', 'auto', '8%', 0]}>
                {sectionNames.map(section => (
                  <React.Fragment key={section}>
                    <PillButtonDark {...btnProps(section)}>{section}</PillButtonDark>
                  </React.Fragment>
                ))}
              </Row>
            </FadeInView>
          </View>
          <FadeInView delayIndex={2} {...fadeAnimations.up}>
            <Grid space={80} alignItems="start" itemMinWidth={280}>
              {sections[activeSection].map(({ title, icon, body }, index) => (
                <SimpleSection
                  key={`${activeSection}${index}`}
                  delay={dly * (index + 1)}
                  title={title}
                >
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
        </Col>

        <View flex={0.15} />

        <View
          sm-display="none"
          position="relative"
          flex={1}
          // alignItems="center"
          justifyContent="center"
        >
          <Image
            width="100%"
            height="auto"
            minWidth={1000}
            marginRight={-1000}
            src={require('../../public/images/screen-graphql.jpg')}
            borderRadius={15}
            overflow="hidden"
            boxShadow={[
              {
                blur: 100,
                color: '#000',
              },
            ]}
          />
        </View>
      </Row>
    </Fade.FadeProvide>
  )
})
