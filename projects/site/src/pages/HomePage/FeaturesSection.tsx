import { Col, Grid, Image, Row, Space, useNodeSize, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useRef, useState } from 'react'

import { useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { ParallaxStageItem } from '../../views/ParallaxStage'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'

const dly = 200

const sectionNames = ['Integrate', 'Display', 'Build']

const sections = {
  [sectionNames[0]]: {
    image: require('../../public/images/screen-graphql.jpg'),
    items: [
      {
        title: `One-click data sources`,
        icon: `data`,
        body: [`Every app can provide data APIs, installs with a simple search + click.`],
      },
      {
        title: 'Query Builder',
        icon: 'code-block',
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
  },
  [sectionNames[1]]: {
    image: require('../../public/images/screen-people.jpg'),
    items: [
      {
        title: 'Complete UI Kit',
        icon: 'button',
        body: [
          `All lists and tables virtualized. React Concurrent rendering. Flexible, consistent data display across all views.`,
        ],
      },
      {
        title: `Drag & Drop Data`,
        icon: `exchange`,
        body: [`First class data drag & drop to move data in or out easily, or between apps.`],
      },
      {
        title: `Every hook you need`,
        icon: `shop`,
        body: [`Extensive libraries for displaying data, all built on the latest React.`],
      },
      {
        title: `Clipboard`,
        icon: `clipboard`,
        body: [`A persistent, incredibly easy way to enable cross-app data sharing.`],
      },
    ],
  },
  [sectionNames[2]]: {
    image: require('../../public/images/screen-graphql.jpg'),
    items: [
      {
        title: `A space to collaborate`,
        icon: `satellite`,
        body: [`The easiest collaboration story: no servers, no credentials.`],
      },
      {
        title: `Next-gen Hot Reload`,
        icon: `refresh`,
        body: [
          `Per-app Webpack for instant React Refresh hot reloading. Toggle between development and production in realtime.`,
        ],
      },
      {
        title: `Modern view system`,
        icon: `grid-view`,
        body: [
          `React Concurrent, Suspense, Framer Motion and more integrated by default, in every view.`,
        ],
      },
      {
        title: `Incredible Dev Tooling`,
        icon: `draw`,
        body: [
          `From logging to data management, state inspection, error recovery and more - Orbit comes with great DX.`,
        ],
      },
    ],
  },
}

const transition = {
  type: 'spring',
  damping: 20,
  stiffness: 200,
}

export default memo(() => {
  const Fade = useFadePage()
  const [activeSection, setActiveSection] = useState(sectionNames[0])
  const gridContainer = useRef(null)
  const gridSize = useNodeSize({
    ref: gridContainer,
    throttle: 350,
  })

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
  const cur = Object.keys(sections).indexOf(activeSection)
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

      <Row
        alignItems="center"
        nodeRef={Fade.ref}
        margin={[0, 'auto']}
        padding={['8vh', 0, '8vh']}
        maxWidth="100vw"
      >
        <Col padding="lg" flex={2}>
          <View flex={1}>
            <ParallaxStageItem>
              <TitleText alignItems="flex-start" justifyContent="flex-start" size="xxl">
                The all-in-one
                <br />
                data studio
              </TitleText>
            </ParallaxStageItem>
            <ParallaxStageItem>
              <Row space="lg" margin={['4%', 'auto', '8%', 0]}>
                {sectionNames.map(section => (
                  <React.Fragment key={section}>
                    <PillButtonDark {...btnProps(section)}>{section}</PillButtonDark>
                  </React.Fragment>
                ))}
              </Row>
            </ParallaxStageItem>
          </View>
          <ParallaxStageItem nodeRef={gridContainer}>
            <Row flexWrap="nowrap">
              {Object.keys(sections).map((section, index) => {
                return (
                  <Grid
                    animate={{
                      opacity: cur === index ? 1 : 0,
                      x:
                        cur === index
                          ? '0%'
                          : cur > index
                          ? `-${(cur - index) * 20}%`
                          : `${(index - cur) * 20}%`,
                    }}
                    pointerEvents={cur === index ? 'auto' : 'none'}
                    transition={transition}
                    key={section}
                    space={20}
                    alignItems="start"
                    itemMinWidth={280}
                    className="feature-grid"
                    marginRight="-100%"
                  >
                    {sections[section].items.map(({ title, icon, body }, index) => (
                      <SimpleSection
                        key={`${section}${index}`}
                        delay={dly * (index + 1)}
                        title={title}
                      >
                        <SectionP>
                          <SectionIcon name={icon} />
                          {flatMap(body, (x, i) => {
                            return (
                              <React.Fragment key={`${section}${i}`}>
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
                )
              })}
            </Row>
          </ParallaxStageItem>
        </Col>

        <View flex={0.15} />

        <View
          sm-display="none"
          position="relative"
          flex={1}
          // alignItems="center"
          // justifyContent="center"
          height={500}
        >
          {Object.keys(sections).map((key, index) => (
            <Image
              key={key}
              transition={transition}
              animate={{
                opacity: cur === index ? 1 : 0,
                y:
                  cur === index
                    ? '0%'
                    : cur > index
                    ? `-${(cur - index) * 20}%`
                    : `${(index - cur) * 20}%`,
              }}
              width="100%"
              position="absolute"
              top={0}
              left={0}
              height="auto"
              minWidth={1000}
              marginRight={-1000}
              src={sections[key].image}
              borderRadius={15}
              overflow="hidden"
              boxShadow={[
                {
                  blur: 100,
                  color: '#000',
                },
              ]}
            />
          ))}
        </View>
      </Row>
    </Fade.FadeProvide>
  )
})
