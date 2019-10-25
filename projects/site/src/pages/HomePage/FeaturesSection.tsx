import { Grid, Image, Space, Stack, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useRef, useState } from 'react'

import { useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { ParallaxStageItem } from '../../views/ParallaxStage'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'

export default memo(function FeaturesSection() {
  const Fade = useFadePage()
  const [activeSection, setActiveSection] = useState(sectionNames[0])
  const gridContainer = useRef(null)
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
        offset={0.5}
        x="90%"
        top="20%"
        scale={2}
        className="glow-two"
        opacity={0.23}
        background="radial-gradient(circle closest-side, #12A1CC, transparent)"
        parallax={geometry => ({
          y: geometry.useParallax(),
          x: geometry.useParallax().transform(x => -x * 1 + 240),
        })}
      />

      <Stack
        direction="horizontal"
        alignItems="center"
        nodeRef={Fade.ref}
        margin={[0, 'auto']}
        padding={['8vh', 0, '8vh']}
        maxWidth="100vw"
      >
        <Stack padding="lg" flex={2}>
          <View flex={1}>
            <ParallaxStageItem stagger={0}>
              <TitleText alignItems="flex-start" justifyContent="flex-start" size="xxl">
                The all-in-one
                <br />
                data studio
              </TitleText>
            </ParallaxStageItem>
            <ParallaxStageItem stagger={1}>
              <Stack direction="horizontal" space="lg" margin={['4%', 'auto', '8%', 0]}>
                {sectionNames.map(section => (
                  <PillButtonDark key={section} {...btnProps(section)}>
                    {section}
                  </PillButtonDark>
                ))}
              </Stack>
            </ParallaxStageItem>
          </View>
          <ParallaxStageItem
            parallax={{
              x: {
                transition: 'ease-in-quad',
                move: 100,
                clamp: [-100, 100],
              },
              opacity: {
                transition: 'ease-in',
                clamp: [0, 1],
              },
            }}
            stagger={2}
            nodeRef={gridContainer}
          >
            <Stack direction="horizontal" flexWrap="nowrap">
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
                    itemMinWidth={240}
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
            </Stack>
          </ParallaxStageItem>
        </Stack>

        <View flex={0.15} />

        <View sm-display="none" position="relative" flex={1.25} height={500}>
          <ParallaxStageItem
            stagger={2}
            parallax={{
              x: {
                transition: 'ease-in-quad',
                move: -150,
                clamp: [-150, 150],
              },
              // rotateY: {
              //   transition: 'ease-in-quad',
              //   move: -100,
              //   clamp: [-200, 200],
              // },
              opacity: {
                transition: 'ease-in',
                clamp: [0, 1],
              },
            }}
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
          </ParallaxStageItem>
        </View>
      </Stack>
    </Fade.FadeProvide>
  )
})

const dly = 200

const sections = {
  Data: {
    image: require('../../public/images/screen-graphql.jpg'),
    items: [
      {
        title: `One-click data sources`,
        icon: `data`,
        body: [`Every app provides data, installs with a click.`],
      },
      {
        title: 'Query Builder',
        icon: 'code-block',
        body: [`Create queries visually, plug into apps with a drag.`],
      },
      {
        title: `GraphQL Explorer`,
        icon: `satellite`,
        body: [`A full graph of your data sources by default.`],
      },
      {
        title: `Manage/Sync Bits`,
        icon: `data`,
        body: [`Store results as bits, use them in other apps easily.`],
      },
    ],
  },
  Display: {
    image: require('../../public/images/screen-people.jpg'),
    items: [
      {
        title: 'Complete UI Kit',
        icon: 'button',
        body: [`Beautiful, flexible, virtualized, concurrent, with easy data loading.`],
      },
      {
        title: `Drag & Drop Data`,
        icon: `exchange`,
        body: [`First class data drag & drop to move data in, out & between apps.`],
      },
      {
        title: `Every hook you need`,
        icon: `shop`,
        body: [`Extensive libraries for displaying data all built on the latest React.`],
      },
      {
        title: `Clipboard`,
        icon: `clipboard`,
        body: [`A persistent, incredibly easy way to enable cross-app data sharing.`],
      },
    ],
  },
  Create: {
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
          `Per-app Webpack with instant React Refresh. Toggle between editing and production instantly.`,
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
          `From debuggins to data management, error recovery and more - Orbit comes with great DX.`,
        ],
      },
    ],
  },
}

const sectionNames = Object.keys(sections)

const transition = {
  type: 'spring',
  damping: 20,
  stiffness: 200,
}
