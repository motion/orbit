import { Grid, Image, ParallaxView, Space, Stack, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useRef, useState } from 'react'
import { LogoCircle } from '../../views/DishLogo'

import { FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
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
      <Page.BackgroundParallax speed={0.4} offset={0.5}>
        <View
          width={100}
          height={100}
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
        // padding={['4vh', 0, '4vh']}
        maxWidth="100%"
      >
        <Stack padding="lg" flex={2}>
          <View flex={1}>
            <ParallaxStageItem stagger={0}>
              <TitleText fontWeight={300} size="sm" alpha={0.5}>
                It's time for a
              </TitleText>
              <Space size={10} />
              <TitleText
                alignItems="flex-start"
                justifyContent="flex-start"
                size="xxxl"
                sizeLineHeight={1.1}
              >
                Better deal.
              </TitleText>
              <Space size={14} />
              <IntroPara delayIndex={1} stagger={0} size={1.7} sizeLineHeight={1.2}>
                <strong style={{ color: '#e61277' }}>The guide that gives back</strong>
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

          <FadeInView parallax delayIndex={2}>
            <Stack space="sm">
              <Item>No config, no code to start an app.</Item>
              <Item>100ms hot reloads with error recovery.</Item>
              <Item>A suite of tools for understanding state/data.</Item>
              <Item>Rich debugging tools built-in.</Item>
            </Stack>
          </FadeInView>
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
            {Object.keys(sections).map((key, index) => {
              const y =
                cur === index
                  ? '0%'
                  : cur > index
                  ? `-${(cur - index) * 20}%`
                  : `${(index - cur) * 20}%`

              if (index === 0) {
                return (
                  <View transform={{ z: 0 }}>
                    <LogoCircle scale={10} />
                  </View>
                )
              }

              return (
                <Image
                  key={key}
                  transition={transition}
                  animate={{
                    opacity: cur === index ? 1 : 0,
                    y,
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
              )
            })}
          </ParallaxStageItem>
        </View>
      </Stack>
    </Fade.FadeProvide>
  )
})

const dly = 200

const sections = {
  Earn: {
    image: require('../../public/images/screen-graphql.jpg'),
    items: [
      {
        title: `Referrals`,
        icon: `data`,
        body: [`Every app provides data, installs with a click.`],
      },
      {
        title: 'Create lists',
        icon: 'code-block',
        body: [`Create queries visually, plug into apps with a drag.`],
      },
      {
        title: `Take photos`,
        icon: `satellite`,
        body: [`A full graph of your data sources by default.`],
      },
      {
        title: `Write reviews`,
        icon: `data`,
        body: [`Store results as bits, use them in other apps easily.`],
      },
    ],
  },
  Explore: {
    image: require('../../public/images/screen-people.jpg'),
    items: [
      {
        title: 'Complete UI Kit',
        icon: 'button',
        body: [`Smart, flexible, virtualized, concurrent, easy data loading.`],
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
  Maintain: {
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
      {
        title: `Incredible Dev Tooling`,
        icon: `draw`,
        body: [`Debugging, data management, error recovery - many dev tools built-in.`],
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
