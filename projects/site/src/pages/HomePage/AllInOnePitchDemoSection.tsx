import { AnimatePresence, animation, Button, Col, gloss, Image, Row, Space, useIntersectionObserver, View } from '@o/ui'
import { Box, Inline } from 'gloss'
import React, { useEffect, useRef, useState } from 'react'

import listScreen from '../../../public/images/screen-list.jpg'
import tableScreen from '../../../public/images/screen-table.jpg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { linkProps } from '../../useLink'
import { fadeAnimations, FadeChild, transitions, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TiltSquircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

const SubSection = props => <Flex minWidth={200} alignItems="center" padding {...props} />

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
  return [ref, val] as const
}

const Dot = gloss(Box, {
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

const CenterText = props => (
  <Paragraph
    {...{
      selectable: true,
      sizeLineHeight: 1.2,
      size: 1.15,
      alpha: 0.68,
      textAlign: 'center',
    }}
    {...props}
  />
)

const Flex = gloss(View, {
  position: 'relative',
  flex: 1,
})

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

const variants = {
  enter: (direction: number) => ({
    x: direction < 0 ? 800 : -800,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 800 : -800,
    opacity: 0,
  }),
}

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export default function NeckSection() {
  const screen = useScreenSize()
  const [ref, show] = useIntersectedOnce()
  const Fade = useFadePage()

  const [[page, direction], setPage] = useState([0, 0])
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }
  const goTo = (page: number) => {
    setPage([page, page > page[0] ? 1 : -1])
  }
  const index = animation.wrap(0, elements.length, page)

  return (
    <Fade.FadeProvide>
      <SpacedPageContent
        nodeRef={Fade.ref}
        header={
          <>
            <FadeChild delay={0}>
              <PillButton>How</PillButton>
            </FadeChild>
            <FadeChild delay={200}>
              <TitleText size={useScreenVal('lg', 'xl', 'xxl')}>All together</TitleText>
            </FadeChild>
            <TitleTextSub nodeRef={ref as any} margin="auto" minWidth={320}>
              <FadeChild style={screen === 'small' ? { display: 'inline' } : null} delay={300}>
                &nbsp;Orbit gives you everything you need to create custom apps.&nbsp;
              </FadeChild>
              <FadeChild style={screen === 'small' ? { display: 'inline' } : null} delay={450}>
                With data sources, views and more, you control the code.
              </FadeChild>
            </TitleTextSub>
          </>
        }
      >
        <Col maxWidth="100%" margin={[0, 'auto', 0, 0]}>
          {screen !== 'small' && (
            <Row space>
              <SubSection maxWidth="33%">
                <FadeChild {...fadeAnimations.left} delay={400}>
                  <PillButtonDark>Import</PillButtonDark>
                  <Space />
                  <CenterText>
                    Plug in the <Inline color="#E01C5A">{elements[index].beforeName}</Inline> data
                    app with a click.
                  </CenterText>
                </FadeChild>
              </SubSection>
              <SubSection flex={2} padding={[true, 'xxl']}>
                <FadeChild delay={500}>
                  <PillButtonDark>Display</PillButtonDark>
                  <Space />
                  <CenterText maxWidth={400} margin={[0, 'auto']}>
                    Develop using powerful, simple views built on React and Typescript, all without
                    setting up a build environment.
                  </CenterText>
                </FadeChild>
              </SubSection>
              <SubSection maxWidth="33%">
                <FadeChild {...fadeAnimations.right} delay={600}>
                  <PillButtonDark>Export</PillButtonDark>
                  <Space />
                  <CenterText>
                    Install <Inline color="#F14336">{elements[index].afterName}</Inline>, use it's
                    simple API to send your results out.
                  </CenterText>
                </FadeChild>
              </SubSection>
            </Row>
          )}

          <Space />

          <Row space>
            <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
              <FadeChild {...fadeAnimations.left} delay={700}>
                <Image
                  userSelect="none"
                  alignSelf="center"
                  width={80}
                  height={80}
                  src={elements[index].iconBefore}
                />
              </FadeChild>
              <Space size="xxl" />
              <FadeChild key={index} {...fadeAnimations.left} delay={800}>
                <Image
                  userSelect="none"
                  opacity={0.5}
                  src={require('../../../public/images/curve-arrow.svg')}
                  transform={{
                    scale: 0.8,
                  }}
                />
              </FadeChild>
            </Flex>
            <Flex
              flex={2}
              alignItems="center"
              position="relative"
              margin={useScreenVal([0, '-5%'], 0, 0)}
            >
              <FadeChild delay={300}>
                <Button
                  alt="flat"
                  cursor="pointer"
                  size={1.9}
                  iconSize={20}
                  circular
                  zIndex={100}
                  position="absolute"
                  top={-4}
                  left={5}
                  icon="chevron-left"
                  onClick={() => paginate(-1)}
                />
                <Button
                  alt="flat"
                  cursor="pointer"
                  size={1.9}
                  iconSize={20}
                  circular
                  zIndex={100}
                  position="absolute"
                  top={-4}
                  right={5}
                  icon="chevron-right"
                  onClick={() => paginate(1)}
                />
              </FadeChild>

              <FadeChild transition={transitions.slowNotBouncy} delay={500}>
                <TiltSquircle
                  {...linkProps(elements[index].link)}
                  tagName="div"
                  width={280}
                  height={280}
                  background={`linear-gradient(125deg, #78009F, #4C1966)`}
                  boxShadow="0 20px 50px rgba(0,0,0,0.6)"
                  padding={30}
                  cursor="pointer"
                  key={index}
                  custom={direction}
                  variants={variants}
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
                    {`<${elements[index].title} />`}
                  </TitleText>
                  <Space />
                  <Paragraph cursor="inherit" sizeLineHeight={1.2} size={1.2} alpha={0.8}>
                    {elements[index].body}
                  </Paragraph>
                </TiltSquircle>
              </FadeChild>

              <FadeChild
                transition={transitions.slowNotBouncy}
                {...fadeAnimations.up}
                delay={800}
                width={400}
                height={300}
                position="relative"
              >
                <AnimatePresence initial={false} custom={direction}>
                  <View
                    key={index}
                    custom={direction}
                    variants={variants}
                    width="100%"
                    height="100%"
                    minWidth={350}
                    borderRadius={22}
                    background="#000"
                    boxShadow={[[0, 10, 30, [0, 0, 0]]]}
                    overflow="hidden"
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 100, damping: 200 },
                      opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    position="absolute"
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x)
                      if (swipe < -swipeConfidenceThreshold) {
                        paginate(1)
                      } else if (swipe > swipeConfidenceThreshold) {
                        paginate(-1)
                      }
                    }}
                  >
                    <Image
                      className="carousel-image"
                      userSelect="none"
                      src={elements[index].image}
                      width="100%"
                      height="auto"
                      opacity={0.45}
                    />
                  </View>
                </AnimatePresence>
              </FadeChild>
            </Flex>

            <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
              <FadeChild {...fadeAnimations.right} delay={400}>
                <Image
                  userSelect="none"
                  alignSelf="center"
                  width={80}
                  height={80}
                  key={index}
                  custom={direction}
                  variants={variants}
                  src={elements[index].iconAfter}
                />
              </FadeChild>
              <Space size="xxl" />
              <FadeChild delay={600}>
                <Image
                  key={index}
                  custom={direction}
                  variants={variants}
                  userSelect="none"
                  opacity={0.5}
                  transform={{
                    rotate: '275deg',
                    scale: 0.8,
                  }}
                  src={require('../../../public/images/curve-arrow.svg')}
                />
              </FadeChild>
            </Flex>
          </Row>

          <Row margin={[32, 'auto', 0]}>
            {[0, 1, 2].map(x => (
              <Dot key={x} active={x === index} onClick={() => goTo(x)} />
            ))}
          </Row>
        </Col>
      </SpacedPageContent>

      <Page.BackgroundParallax
        speed={0.4}
        offset={0.45}
        x="-35%"
        scale={1.5}
        className="glow-one"
        opacity={0.22}
        background="radial-gradient(circle closest-side, #F64097, transparent)"
      />

      <Page.BackgroundParallax
        speed={0.4}
        offset={0.3}
        x="40%"
        scale={1.68}
        className="glow-two"
        opacity={0.25}
        background="radial-gradient(circle closest-side, #00E5FF, transparent)"
      />
    </Fade.FadeProvide>
  )
}
