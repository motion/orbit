import { Inline } from '@o/gloss'
import { useForceUpdate } from '@o/kit'
import { Button, Col, FullScreen, gloss, Image, Row, Space, TextProps, useGetFn, View } from '@o/ui'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import northernlights from '../../../public/images/northern-lights.svg'
import listScreen from '../../../public/images/screen-list.jpg'
import tableScreen from '../../../public/images/screen-table.jpg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeIn } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButtonDark } from '../../views/PillButtonDark'
import { Spotlight } from '../../views/Spotlight'
import { Squircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'

export const TitleTextSub = gloss((props: TextProps) => (
  <View width="90%" maxWidth={800} minWidth={300} textAlign="center">
    <TitleText size="sm" fontWeight={300} alpha={0.5} {...props} />
  </View>
))

const nextStyle = {
  opacity: 0,
  transform: `translate3d(20px,0,0)`,
}
const curStyle = {
  opacity: 1,
  transform: `translate3d(0,0,0)`,
}
const prevStyle = {
  opacity: 0,
  transform: `translate3d(-20px,0,0)`,
}
let animate = 'in'
const fadeOutTm = 250

const sleep = ms => new Promise(res => setTimeout(res, ms))

function useSlideSpring(config, delay = 0) {
  return useSpring({
    from: nextStyle,
    to: async (next, cancel) => {
      cancel()
      switch (animate) {
        case 'in':
          next(curStyle)
          return
        case 'next':
          await sleep(delay)
          // out
          await next({
            to: prevStyle,
            config: {
              duration: fadeOutTm,
            },
          })
          // move to other side
          await next({
            to: {
              opacity: 0,
              transform: `translate3d(40px,0,0)`,
            },
            config: {
              duration: 180,
            },
          })
          await sleep(delay)
          // in
          await next({
            to: curStyle,
            config,
          })
          // maybe put this earlier
          animate = 'in'
          return
      }
    },
    config,
  })
}

const elements = [
  {
    iconBefore: require('../../../public/logos/slack.svg'),
    title: 'Table',
    body: `The table that has it all. Virtualized, resizable, sortable, filterable, multi-selectable, and more. With easy sharing to forms, lists, or other apps in your Orbit.`,
    image: tableScreen,
    iconAfter: require('../../../public/logos/gmail.svg'),
    afterName: 'Gmail',
    beforeName: 'Slack',
  },
  {
    iconBefore: require('../../../public/logos/postgres.svg'),
    title: 'List',
    body: `Every list in Orbit accepts the same props as tables. They are incredibly powerful, virtualized by default, and can group, filter, search, and share with a prop.`,
    image: listScreen,
    iconAfter: require('../../../public/logos/jira.svg'),
    afterName: 'Jira',
    beforeName: 'Postgres',
  },
  {
    iconBefore: require('../../../public/logos/medium.svg'),
    title: 'Grid',
    body: `Orbit Grids automatically persist their state. They can be easily arranged and resized, and plugging in app data inside them is as easy as nesting an <AppCard />.`,
    image: listScreen,
    iconAfter: require('../../../public/logos/sheets.svg'),
    afterName: 'GSheets',
    beforeName: 'Web Crawl',
  },
]

export function NeckSection(props) {
  const screen = useScreenSize()
  const forceUpdate = useForceUpdate()
  const nextInt = useRef(null)

  const longDelay = 150
  const springFast = useSlideSpring({
    mass: 1,
    tension: 150,
    friction: 10,
  })
  const springSlow = useSlideSpring(
    {
      mass: 1,
      tension: 120,
      friction: 8,
    },
    longDelay / 2,
  )
  const springSlowest = useSlideSpring(
    {
      mass: 1,
      tension: 120,
      friction: 8,
    },
    longDelay,
  )

  const [cur, setCur] = useState(0)

  const next = async (e?) => {
    if (e) clearInterval(nextInt.current)
    animate = 'next'
    forceUpdate()
    await sleep(fadeOutTm + longDelay)
    let n = (cur + 1) % elements.length
    setCur(n)
  }
  const prev = (e?) => {
    if (e) clearInterval(nextInt.current)
    setCur(cur + 1)
  }

  const curNext = useGetFn(next)
  useEffect(() => {
    nextInt.current = setInterval(() => {
      curNext()
    }, 8000)

    return () => clearInterval(nextInt.current)
  }, [])

  return (
    <Page zIndex={3} {...props}>
      <Page.Content
        transform={{
          y: '-4%',
        }}
      >
        <SpacedPageContent
          header={
            <>
              <FadeIn delay={100} intersection="20px">
                <TitleText size={useScreenVal('lg', 'xl', 'xxl')}>All together.</TitleText>
              </FadeIn>
              <TitleTextSub width="87%" margin="auto" minWidth={320}>
                <FadeIn delay={200} intersection="20px">
                  Orbit has everything you need to build powerful apps with code, easily. Including
                  the development environment.
                </FadeIn>
              </TitleTextSub>
            </>
          }
        >
          <Col maxWidth="100%" margin={[0, 'auto']}>
            {screen !== 'small' && (
              <Row space flexWrap={screen === 'small' ? 'wrap' : 'nowrap'}>
                <SubSection maxWidth="33%">
                  <FadeIn delay={300} intersection="20px">
                    <PillButtonDark>Import</PillButtonDark>
                    <Space />
                    <CenterText>
                      Apps like <Inline color="#E01C5A">{elements[cur].beforeName}</Inline> provide
                      data with just a line of code.
                    </CenterText>
                  </FadeIn>
                </SubSection>
                <SubSection flex={2} pad={[true, 'xxl']}>
                  <FadeIn delay={400} intersection="20px">
                    <PillButtonDark>Display</PillButtonDark>
                    <Space />
                    <CenterText maxWidth={400} margin={[0, 'auto']}>
                      Orbit provides a large, cohesive set of views and APIs that are useful for
                      internal tools, like a {elements[cur].title}.
                    </CenterText>
                  </FadeIn>
                </SubSection>
                <SubSection maxWidth="33%">
                  <FadeIn delay={500} intersection="20px">
                    <PillButtonDark>Export</PillButtonDark>
                    <Space />
                    <CenterText>
                      With selections + actions, exporting to{' '}
                      <Inline color="#F14336">{elements[cur].afterName}</Inline> is easy.
                    </CenterText>
                  </FadeIn>
                </SubSection>
              </Row>
            )}

            <Space />

            <Row space>
              <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                <animated.div style={springFast}>
                  <Image
                    alignSelf="center"
                    width={124}
                    height={124}
                    src={elements[cur].iconBefore}
                  />
                </animated.div>
                <Space size="xxl" />
                <animated.div style={{ ...springFast, alignSelf: 'flex-end' }}>
                  <Image
                    opacity={0.5}
                    src={require('../../../public/images/curve-arrow.svg')}
                    transform={{
                      scale: 0.8,
                    }}
                  />
                </animated.div>
              </Flex>
              <Flex flex={2} position="relative">
                <Button
                  alt="clear"
                  cursor="pointer"
                  size={2}
                  iconSize={22}
                  circular
                  zIndex={100}
                  position="absolute"
                  top={-4}
                  left={10}
                  icon="chevron-left"
                  onClick={prev}
                />
                <Button
                  alt="clear"
                  cursor="pointer"
                  size={2}
                  iconSize={22}
                  circular
                  zIndex={100}
                  position="absolute"
                  top={-4}
                  right={10}
                  icon="chevron-right"
                  onClick={next}
                />

                <animated.div style={{ ...springSlowest, margin: 'auto' }}>
                  <Squircle
                    width={280}
                    height={280}
                    background="linear-gradient(125deg, #78009F, #4C1966)"
                    boxShadow="0 10px 50px rgba(0,0,0,0.5)"
                    padding={30}
                  >
                    <TitleText
                      fontSize={18}
                      margin={[0, 'auto']}
                      letterSpacing={2}
                      alpha={0.65}
                      textTransform="uppercase"
                    >
                      {`<${elements[cur].title} />`}
                    </TitleText>
                    <Space />
                    <Paragraph sizeLineHeight={1.2} size={1.2} alpha={0.8}>
                      {elements[cur].body}
                    </Paragraph>
                  </Squircle>
                </animated.div>

                <animated.div style={{ ...springSlow, marginTop: -215, height: 300, zIndex: -1 }}>
                  <View
                    backgroundImage={`url(${elements[cur].image})`}
                    backgroundSize="101%"
                    backgroundPosition="-1px -2px -2px -2px"
                    width="100%"
                    height={300}
                    borderRadius={10}
                    boxShadow={[[0, 10, 30, [0, 0, 0]]]}
                  />
                </animated.div>
              </Flex>

              <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                <animated.div style={springSlowest}>
                  <Image
                    alignSelf="center"
                    width={124}
                    height={124}
                    src={elements[cur].iconAfter}
                  />
                </animated.div>
                <Space size="xxl" />
                <animated.div style={{ ...springFast, alignSelf: 'flex-start' }}>
                  <Image
                    opacity={0.5}
                    transform={{
                      rotate: '275deg',
                      scale: 0.8,
                    }}
                    src={require('../../../public/images/curve-arrow.svg')}
                  />
                </animated.div>
              </Flex>
            </Row>
          </Col>
        </SpacedPageContent>
      </Page.Content>

      <Page.Parallax speed={0.3} zIndex={-2}>
        <FullScreen
          className="northern-lights"
          backgroundImage={`url(${northernlights})`}
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
          opacity={0.8}
        />
        <Spotlight />
      </Page.Parallax>
    </Page>
  )
}

const CenterText = gloss(
  props => (
    <Paragraph
      {...{
        selectable: true,
        sizeLineHeight: 1.2,
        size: 1.25,
        alpha: 0.8,
      }}
      {...props}
    />
  ),
  {
    textAlign: 'center',
  },
)

export const Flex = gloss(View, {
  position: 'relative',
  flex: 1,
})

const SubSection = gloss(props => <Flex minWidth={200} pad {...props} />)
