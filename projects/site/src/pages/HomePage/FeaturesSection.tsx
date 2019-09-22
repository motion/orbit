import { Col, Grid, Image, Row, Space, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useState } from 'react'

import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'

const dly = 200

const sectionNames = ['Collaborate', 'App Kit', 'Publish']

const sections = {
  [sectionNames[0]]: [
    {
      title: 'Apps work together',
      icon: 'apps',
      body: [`Apps with typed APIs and GraphQL.`],
    },
    {
      title: `A space to collaborate`,
      icon: `satellite`,
      body: [`The easiest collaboration story: no servers, no credentials.`],
    },
    {
      title: `Stunning, easy apps`,
      icon: `shop`,
      body: [`A UI Kit with everything you need.`],
    },
    {
      title: `An interface for data`,
      icon: `widget`,
      body: [`Everything optimized for speed and ease of use.`],
    },
  ],
  [sectionNames[1]]: [
    {
      title: 'Modern & standard',
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
      <Row nodeRef={Fade.ref} margin={[0, 'auto']} padding={['8vh', 0, '8vh']}>
        <Col padding="lg" flex={2}>
          <View flex={1}>
            <FadeInView delayIndex={1}>
              <TitleText alignItems="flex-start" justifyContent="flex-start" size="xxl">
                The all-in-one
                <br />
                platform
              </TitleText>
            </FadeInView>
            <FadeInView delayIndex={1} {...fadeAnimations.up}>
              <Row space="lg" margin={[40, 'auto', 60, 0]}>
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

        <View flex={0.2} />

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
