import { Grid, Image, ParallaxView, Space, Stack, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useRef, useState } from 'react'
import { LogoCircle } from '../../views/DishLogo'

import { useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { ParallaxStageItem } from '../../views/ParallaxStage'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { IntroPara } from './IntroPara'
import { Item } from './Item'
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
        opacity={0.26}
        background="radial-gradient(circle closest-side, #12A1CC, transparent)"
        parallax={geometry => ({
          y: geometry.useParallax(),
          x: geometry.useParallax().transform(x => -x * 1 + 240),
        })}
      />

      <Page.BackgroundParallax speed={0.4} offset={0.5}>
        <View
          width={1200}
          height={1200}
          borderRadius={1000}
          borderWidth={1}
          borderColor="rgba(255,255,255,0.3)"
        />
      </Page.BackgroundParallax>

      <Stack
        direction="horizontal"
        alignItems="center"
        nodeRef={Fade.ref}
        margin={[0, 'auto']}
        padding={[0, 0, 100, 0]}
        maxWidth="100vw"
      >
        <Stack padding="lg" flex={2}>
          <View flex={1}>
            <ParallaxStageItem stagger={0}>
              <TitleText fontWeight={300} size="sm" alpha={0.5}>
                Dishcoin is simply
              </TitleText>
              <Space size={10} />
              <TitleText
                alignItems="flex-start"
                justifyContent="flex-start"
                size="xxxl"
                sizeLineHeight={1.1}
              >
                A better deal.
              </TitleText>
              <Space size={14} />
              <IntroPara delayIndex={1} stagger={0} size={1.7} sizeLineHeight={1.2}>
                <strong style={{ color: '#e61277' }}>When you add this up</strong>, why wouldn't
                you?
              </IntroPara>
            </ParallaxStageItem>
            <Space size={10} />
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
                  <Stack
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
                    // itemMinWidth={240}
                    className="feature-grid"
                    marginRight="-100%"
                  >
                    {sections[section].items.map(({ title, icon, body }, index) => (
                      <Item key={`${section}${index}`} delay={dly * (index + 1)} title={title}>
                        <SectionP>
                          {/* <SectionIcon name={icon} /> */}
                          {flatMap(body, (x, i) => {
                            return (
                              <React.Fragment key={i}>
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
                      </Item>
                    ))}
                  </Stack>
                )
              })}
            </Stack>
          </ParallaxStageItem>
        </Stack>

        <View flex={0.15} />

        <View sm-display="none" position="relative" transform={{ x: -40 }} flex={1.25} height={500}>
          <ParallaxStageItem
            stagger={2}
            parallax={{
              x: {
                transition: 'ease-in-quad',
                move: -150,
                clamp: [-150, 400],
              },
              rotateY: {
                transition: 'ease-in-quad',
                move: -100,
                clamp: [-200, 600],
              },
              opacity: {
                transition: 'ease-in',
                clamp: [0, 2],
              },
            }}
          >
            <LogoCircle scale={12} />
          </ParallaxStageItem>
        </View>
      </Stack>
    </Fade.FadeProvide>
  )
})

const dly = 200

const sections = {
  Founders: {
    image: require('../../public/images/screen-graphql.jpg'),
    items: [
      {
        icon: `data`,
        body: [`Less pressure to grow fast.`],
      },
      {
        icon: 'code-block',
        body: [`Raise money on their terms.`],
      },
      {
        icon: `satellite`,
        body: [`Pitch to customers directly.`],
      },
    ],
  },
  Investors: {
    image: require('../../public/images/screen-people.jpg'),
    items: [
      {
        icon: 'button',
        body: [`Clearer.`],
      },
      {
        icon: `exchange`,
        body: [`First class data drag & drop to move data in, out & between apps.`],
      },
      {
        icon: `shop`,
        body: [`Extensive libraries for displaying data all built on the latest React.`],
      },
    ],
  },
  Community: {
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
        body: [`Per-app Webpack for instant HMR. Every app is editable at runtime.`],
      },
      {
        title: `Modern view system`,
        icon: `grid-view`,
        body: [`React Concurrent, Suspense, Framer Motion and more, in every view.`],
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
