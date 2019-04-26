import { Inline } from '@o/gloss'
import { Button, Col, FullScreen, gloss, Image, Row, Space, TextProps, useGetFn, useIntersectionObserver, View } from '@o/ui'
import { useForceUpdate } from '@o/use-store'
import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'

import lineSep from '../../../public/images/line-sep.svg'
import northernlights from '../../../public/images/northern-lights.svg'
import listScreen from '../../../public/images/screen-list.jpg'
import tableScreen from '../../../public/images/screen-table.jpg'
import { colors } from '../../constants'
import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeChild, fadeLeftProps, fadeRightProps, fadeUpProps, slowConfigLessBounce, useFadePage } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
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
    beforeName: 'Crawler',
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

export function NeckSection(props) {
  const screen = useScreenSize()
  const forceUpdate = useForceUpdate()
  const nextInt = useRef(null)
  const [ref, show] = useIntersectedOnce()

  const longDelay = 100
  const springFast = useSlideSpring({
    mass: 0.5,
    tension: 150,
    friction: 12,
  })
  const springSlow = useSlideSpring(
    {
      mass: 0.5,
      tension: 120,
      friction: 12,
    },
    longDelay / 2,
  )
  const springSlowest = useSlideSpring(
    {
      mass: 0.5,
      tension: 120,
      friction: 12,
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
  const prev = async (e?) => {
    if (e) clearInterval(nextInt.current)
    animate = 'prev'
    forceUpdate()
    await sleep(fadeOutTm + longDelay)
    let n = cur - 1
    setCur(n < 0 ? elements.length - 1 : n)
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
      <Page overflow="hidden" zIndex={3} {...props}>
        <Page.Content ref={Fade.ref} transform={{ y: '2%' }}>
          <SpacedPageContent
            header={
              <>
                <FadeChild delay={0}>
                  <PillButton>How</PillButton>
                </FadeChild>
                <FadeChild delay={100}>
                  <TitleText size={useScreenVal('lg', 'xxl', 'xxxl')}>Easiest apps ever.</TitleText>
                </FadeChild>
                <TitleTextSub ref={ref} width="87%" margin="auto" minWidth={320}>
                  <FadeChild delay={200}>
                    Create apps using common data sources in just a few lines of code.
                  </FadeChild>
                </TitleTextSub>
              </>
            }
          >
            <Col maxWidth="100%" margin={[-20, 'auto', 0, 0]}>
              {screen !== 'small' && (
                <Row space>
                  <SubSection maxWidth="33%">
                    <FadeChild {...fadeLeftProps} delay={200}>
                      <PillButtonDark>1. Import</PillButtonDark>
                      <Space />
                      <CenterText>
                        Apps like <Inline color="#E01C5A">{elements[cur].beforeName}</Inline>{' '}
                        provide data with just a line of code.
                      </CenterText>
                    </FadeChild>
                  </SubSection>
                  <SubSection flex={2} pad={[true, 'xxl']}>
                    <FadeChild delay={400}>
                      <PillButtonDark>2. Display</PillButtonDark>
                      <Space />
                      <CenterText maxWidth={400} margin={[0, 'auto']}>
                        Orbit provides everything you need to build tools fast, with powerful views
                        like a {elements[cur].title}.
                      </CenterText>
                    </FadeChild>
                  </SubSection>
                  <SubSection maxWidth="33%">
                    <FadeChild {...fadeRightProps} delay={200}>
                      <PillButtonDark>3. Export</PillButtonDark>
                      <Space />
                      <CenterText>
                        With selections + actions, exporting to{' '}
                        <Inline color="#F14336">{elements[cur].afterName}</Inline> is easy.
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
                        alignSelf="center"
                        width={124}
                        height={124}
                        src={elements[cur].iconBefore}
                      />
                    </FadeChild>
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
                <Flex flex={2} position="relative" margin={useScreenVal([0, '-5%'], 0, 0)}>
                  <Button
                    alt="flat"
                    cursor="pointer"
                    size={2}
                    iconSize={22}
                    circular
                    zIndex={100}
                    position="absolute"
                    top={-4}
                    left={useScreenVal(-20, 10, 10)}
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
                    right={useScreenVal(-20, 10, 10)}
                    icon="chevron-right"
                    onClick={next}
                  />

                  <FadeChild config={slowConfigLessBounce} delay={300}>
                    <animated.div style={{ ...springSlowest, margin: 'auto' }}>
                      <Squircle
                        width={280}
                        height={280}
                        background="linear-gradient(125deg, #151515, #000)"
                        boxShadow="0 10px 80px rgba(0,0,0,1)"
                        padding={30}
                      >
                        <TitleText
                          fontSize={18}
                          margin={[0, 'auto']}
                          letterSpacing={2}
                          alpha={0.65}
                          textTransform="uppercase"
                          color={colors.purple}
                        >
                          {`<${elements[cur].title} />`}
                        </TitleText>
                        <Space />
                        <Paragraph sizeLineHeight={1.2} size={1.2} alpha={0.8}>
                          {elements[cur].body}
                        </Paragraph>
                      </Squircle>
                    </animated.div>
                  </FadeChild>

                  <animated.div style={{ ...springSlow, marginTop: -215, height: 300, zIndex: -1 }}>
                    <FadeChild config={slowConfigLessBounce} {...fadeUpProps} delay={500}>
                      <View
                        width="100%"
                        height={280}
                        minWidth={360}
                        margin={[0, -10]}
                        borderRadius={10}
                        boxShadow={[[0, 10, 30, [0, 0, 0]]]}
                        overflow="hidden"
                      >
                        <Image src={elements[cur].image} width="100%" height="auto" />
                      </View>
                    </FadeChild>
                  </animated.div>
                </Flex>

                <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                  <FadeChild {...fadeRightProps} delay={200}>
                    <animated.div style={springSlowest}>
                      <Image
                        alignSelf="center"
                        width={124}
                        height={124}
                        src={elements[cur].iconAfter}
                      />
                    </animated.div>
                  </FadeChild>
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

        <Page.Parallax overflow="visible" speed={0} zIndex={0}>
          <FullScreen
            transform={{ y: -100 }}
            minWidth={2012}
            margin={[0, -620]}
            top={0}
            bottom="auto"
          >
            <img src={lineSep} />
          </FullScreen>
        </Page.Parallax>

        <Page.Parallax speed={0} zIndex={-5} overflow="hidden">
          <FullScreen zIndex={0}>
            <FullScreen
              className="northern-lights"
              backgroundImage={`url(${northernlights})`}
              backgroundSize="cover"
              backgroundPosition="center center"
              backgroundRepeat="no-repeat"
              opacity={0.6}
            />
            <Spotlight />
          </FullScreen>
        </Page.Parallax>
      </Page>
    </Fade.FadeProvide>
  )
}

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

export const Flex = gloss(View, {
  position: 'relative',
  flex: 1,
})

const SubSection = gloss(props => <Flex minWidth={200} pad {...props} />)
