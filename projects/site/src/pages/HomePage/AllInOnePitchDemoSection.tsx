import { Button, Col, FullScreen, gloss, Image, Row, Space, useGetFn, useIntersectionObserver, View } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import { Inline } from 'gloss'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import listScreen from '../../../public/images/screen-list.jpg'
import tableScreen from '../../../public/images/screen-table.jpg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeChild, fadeLeftProps, fadeRightProps, fadeUpProps, slowConfigLessBounce, useFadePage } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TiltSquircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'
import { LineSep } from './LineSep'
import { linkProps } from './linkProps'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

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
let strategy = 'in'
const fadeOutTm = 250

const sleep = ms => new Promise(res => setTimeout(res, ms))

const elements = [
  {
    iconBefore: require('../../../public/logos/slack.svg'),
    title: 'Table',
    body: `The table that has it all. Virtualized, resizable, sortable, filterable, multi-selectable, and more. With easy sharing to forms, lists, or other apps in your Orbit.`,
    image: tableScreen,
    iconAfter: require('../../../public/logos/gmail.svg'),
    afterName: 'Gmail',
    beforeName: 'Slack',
    link: '/docs/table',
  },
  {
    iconBefore: require('../../../public/logos/postgres.svg'),
    title: 'List',
    body: `Every list in Orbit accepts the same props as tables. They are incredibly powerful, virtualized by default, and can group, filter, search, and share with a prop.`,
    image: listScreen,
    iconAfter: require('../../../public/logos/jira.svg'),
    afterName: 'Jira',
    beforeName: 'Postgres',
    link: '/docs/list',
  },
  {
    iconBefore: require('../../../public/logos/medium.svg'),
    title: 'Grid',
    body: `Orbit Grids automatically persist their state. They can be easily arranged and resized, and plugging in app data inside them is as easy as nesting an <AppCard />.`,
    image: listScreen,
    iconAfter: require('../../../public/logos/sheets.svg'),
    afterName: 'GSheets',
    beforeName: 'Crawler',
    link: '/docs/grid',
  },
]

const useIntersectedOnce = () => {
  const ref = useRef(null)
  const [val, setVal] = useState(false)
  const entries = useIntersectionObserver({ ref })
  const isIntersecting = entries && entries[0].isIntersecting
  useEffect(() => {
    if (isIntersecting && !val) {
      setVal(true)
    }
  }, [val, isIntersecting])
  return [ref, val]
}

const fastConfig = {
  mass: 0.5,
  tension: 150,
  friction: 12,
}

const slowConfig = {
  mass: 0.5,
  tension: 120,
  friction: 12,
}

const slowestConfig = {
  mass: 0.5,
  tension: 120,
  friction: 12,
}

type AnimateTo = (config: any, delay: any) => (next: any, cancel: any) => any

const createSlideSpringTo: AnimateTo = (config, delay) => {
  return async next => {
    switch (strategy) {
      case 'in':
        await next(curStyle)
        return
      case 'next':
        console.log('next')
        // await sleep(delay)
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
        strategy = 'in'
        return
      case 'prev':
        await sleep(delay)
        // out
        await next({
          to: nextStyle,
          config: {
            duration: fadeOutTm,
          },
        })
        // move to other side
        await next({
          to: {
            opacity: 0,
            transform: `translate3d(-40px,0,0)`,
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
        strategy = 'in'
        return
    }
  }
}

function useSlideSpring(config, delay = 0) {
  return useSpring({
    from: nextStyle,
    to: createSlideSpringTo(config, delay),
    config,
  })
}

export default function NeckSection() {
  const screen = useScreenSize()
  const nextInt = useRef(null)
  const [ref, show] = useIntersectedOnce()

  const longDelay = 100
  const forceUpdate = useForceUpdate()
  const springFast = useSlideSpring(fastConfig)
  const springSlow = useSlideSpring(slowConfig, longDelay / 2)
  const springSlowest = useSlideSpring(slowestConfig, longDelay)

  const [cur, setCur] = useState(0)

  const goTo = async index => {
    clearInterval(nextInt.current)
    strategy = index < cur ? 'prev' : 'next'
    forceUpdate()
    await sleep(fadeOutTm + longDelay)
    setCur(index)
  }
  const next = async () => {
    goTo((cur + 1) % elements.length)
  }
  const prev = async () => {
    let n = cur - 1
    goTo(n < 0 ? elements.length - 1 : n)
  }

  // autoplay on intersect
  const curNext = useGetFn(next)
  useEffect(() => {
    if (!show) return
    nextInt.current = setInterval(() => {
      curNext()
    }, 8000)

    return () => clearInterval(nextInt.current)
  }, [show])

  const Fade = useFadePage()

  return (
    <Fade.FadeProvide>
      <Page.Content ref={Fade.ref} transform={{ y: 0 }}>
        <SpacedPageContent
          header={
            <>
              <FadeChild delay={0}>
                <PillButton>Unify</PillButton>
              </FadeChild>
              <FadeChild delay={100}>
                <TitleText size={useScreenVal('lg', 'xxxl', 'xxxl')}>All together now.</TitleText>
              </FadeChild>
              <TitleTextSub ref={ref} margin="auto" minWidth={320}>
                <FadeChild delay={200}>Orbit makes common apps incredibly easy to build.</FadeChild>
              </TitleTextSub>
            </>
          }
        >
          <Col maxWidth="100%" margin={[-10, 'auto', 0, 0]}>
            {screen !== 'small' && (
              <Row space>
                <SubSection maxWidth="33%">
                  <FadeChild {...fadeLeftProps} delay={200}>
                    <PillButtonDark>Import</PillButtonDark>
                    <Space />
                    <CenterText>
                      Plug in data apps like{' '}
                      <Inline color="#E01C5A">{elements[cur].beforeName}</Inline> with a click.
                    </CenterText>
                  </FadeChild>
                </SubSection>
                <SubSection flex={2} pad={[true, 'xxl']}>
                  <FadeChild delay={400}>
                    <PillButtonDark>Display</PillButtonDark>
                    <Space />
                    <CenterText maxWidth={400} margin={[0, 'auto']}>
                      Every view in Orbit is fast, works together & is just lines of code, like the{' '}
                      {elements[cur].title}.
                    </CenterText>
                  </FadeChild>
                </SubSection>
                <SubSection maxWidth="33%">
                  <FadeChild {...fadeRightProps} delay={200}>
                    <PillButtonDark>Export</PillButtonDark>
                    <Space />
                    <CenterText>
                      Built-in select & share to other apps, like{' '}
                      <Inline color="#F14336">{elements[cur].afterName}</Inline>.
                    </CenterText>
                  </FadeChild>
                </SubSection>
              </Row>
            )}

            <Space />

            <Row space>
              <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                <animated.div style={springFast}>
                  <FadeChild {...fadeLeftProps} delay={300}>
                    <Image
                      userSelect="none"
                      alignSelf="center"
                      width={100}
                      height={100}
                      src={elements[cur].iconBefore}
                    />
                  </FadeChild>
                </animated.div>
                <Space size="xxl" />
                <animated.div style={{ ...springFast, alignSelf: 'flex-end' }}>
                  <FadeChild delay={400}>
                    <Image
                      userSelect="none"
                      opacity={0.5}
                      src={require('../../../public/images/curve-arrow.svg')}
                      transform={{
                        scale: 0.8,
                      }}
                    />
                  </FadeChild>
                </animated.div>
              </Flex>
              <Flex flex={2} position="relative" margin={useScreenVal([0, '-5%'], 0, 0)}>
                <FadeChild>
                  <Button
                    alt="flat"
                    cursor="pointer"
                    size={2}
                    iconSize={22}
                    circular
                    zIndex={100}
                    position="absolute"
                    top={-4}
                    left={5}
                    icon="chevron-left"
                    onClick={prev}
                  />
                  <Button
                    alt="flat"
                    cursor="pointer"
                    size={2}
                    iconSize={22}
                    circular
                    zIndex={100}
                    position="absolute"
                    top={-4}
                    right={5}
                    icon="chevron-right"
                    onClick={next}
                  />
                </FadeChild>

                <animated.div style={{ ...springSlowest, margin: 'auto' }}>
                  <FadeChild config={slowConfigLessBounce} delay={300}>
                    <TiltSquircle
                      {...linkProps(elements[cur].link)}
                      tagName="div"
                      width={280}
                      height={280}
                      background={`linear-gradient(125deg, #78009F, #4C1966)`}
                      boxShadow="0 20px 50px rgba(0,0,0,0.6)"
                      padding={30}
                      cursor="pointer"
                    >
                      <TitleText
                        fontSize={18}
                        margin={[0, 'auto']}
                        letterSpacing={2}
                        alpha={0.4}
                        textTransform="uppercase"
                        color="#fff"
                        cursor="inherit"
                      >
                        {`<${elements[cur].title} />`}
                      </TitleText>
                      <Space />
                      <Paragraph cursor="inherit" sizeLineHeight={1.2} size={1.2} alpha={0.8}>
                        {elements[cur].body}
                      </Paragraph>
                    </TiltSquircle>
                  </FadeChild>
                </animated.div>

                <animated.div
                  style={{
                    ...springSlow,
                    marginTop: -215,
                    height: 300,
                    zIndex: -1,
                  }}
                >
                  <FadeChild config={slowConfigLessBounce} {...fadeUpProps} delay={500}>
                    <View
                      width="100%"
                      height={300}
                      minWidth={350}
                      borderRadius={22}
                      background="#000"
                      boxShadow={[[0, 10, 30, [0, 0, 0]]]}
                      overflow="hidden"
                    >
                      <Image
                        className="carousel-image"
                        userSelect="none"
                        src={elements[cur].image}
                        width="100%"
                        height="auto"
                        opacity={0.45}
                      />
                    </View>
                  </FadeChild>
                </animated.div>
              </Flex>

              <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                <FadeChild {...fadeRightProps} delay={200}>
                  <animated.div style={springSlowest}>
                    <Image
                      userSelect="none"
                      alignSelf="center"
                      width={100}
                      height={100}
                      src={elements[cur].iconAfter}
                    />
                  </animated.div>
                </FadeChild>
                <Space size="xxl" />
                <animated.div style={{ ...springFast, alignSelf: 'flex-start' }}>
                  <FadeChild delay={400}>
                    <Image
                      userSelect="none"
                      opacity={0.5}
                      transform={{
                        rotate: '275deg',
                        scale: 0.8,
                      }}
                      src={require('../../../public/images/curve-arrow.svg')}
                    />
                  </FadeChild>
                </animated.div>
              </Flex>
            </Row>

            <Row margin={[32, 'auto', 0]}>
              {[0, 1, 2].map(x => (
                <Dot key={x} active={x === cur} onClick={() => goTo(x)} />
              ))}
            </Row>
          </Col>
        </SpacedPageContent>
      </Page.Content>

      <Page.Parallax overflow="visible" speed={0} zIndex={0}>
        <FullScreen
          transform={{ y: -120 }}
          minWidth={1000}
          margin={[0, '-5vw']}
          top={40}
          bottom="auto"
          className="head-line-sep"
        >
          {false && <LineSep />}
        </FullScreen>
      </Page.Parallax>

      <Page.Parallax speed={0.4} zIndex={-1}>
        <FullScreen
          opacity={0.24}
          transform={{ y: '-10%', scale: 2.4 }}
          background="radial-gradient(circle closest-side, #4A00A8ee 20%, #750750aa, transparent)"
        />
      </Page.Parallax>
    </Fade.FadeProvide>
  )
}

const Dot = gloss({
  borderRadius: 100,
  width: 9,
  height: 9,
  border: [5, 'transparent'],
  margin: [0, 10],
  background: [255, 255, 255, 0.5],
  opacity: 0.5,
  cursor: 'pointer',
  transition: 'all ease 300ms',

  active: {
    opacity: 1,
  },

  '&:hover': {
    opacity: 0.8,
  },
})

const CenterText = gloss(
  props => (
    <Paragraph
      {...{
        selectable: true,
        sizeLineHeight: 1.2,
        size: 1.2,
        alpha: 0.8,
      }}
      {...props}
    />
  ),
  {
    textAlign: 'center',
  },
)

const Flex = gloss(View, {
  position: 'relative',
  flex: 1,
})

const SubSection = gloss(props => <Flex minWidth={200} pad {...props} />)
