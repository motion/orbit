import { AnimatePresence, animation, Button, Col, gloss, Image, Row, Space, useIntersectionObserver, View } from '@o/ui'
import { Box, Inline } from 'gloss'
import React, { memo, useEffect, useRef, useState } from 'react'

import { mediaStyles } from '../../constants'
import listScreen from '../../public/images/screen-list.jpg'
import tableScreen from '../../public/images/screen-table.jpg'
import { linkProps } from '../../useLink'
import { fadeAnimations, FadeInView, transitions, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TiltSquircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
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

const elements = [
  {
    iconBefore: require('../../public/logos/slack.svg'),
    title: 'Table',
    body: `The table that has it all. Virtualized, resizable, sortable, filterable, multi-selectable, and more. With easy sharing to forms, lists, or other apps in your Orbit.`,
    image: tableScreen,
    iconAfter: require('../../public/logos/gmail.svg'),
    afterName: 'Gmail',
    beforeName: 'Slack',
    link: '/docs/table',
  },
  {
    iconBefore: require('../../public/logos/postgres.svg'),
    title: 'List',
    body: `Every list in Orbit accepts the same props as tables. They are incredibly powerful, virtualized by default, and can group, filter, search, and share with a prop.`,
    image: listScreen,
    iconAfter: require('../../public/logos/jira.svg'),
    afterName: 'Jira',
    beforeName: 'Postgres',
    link: '/docs/list',
  },
  {
    iconBefore: require('../../public/logos/medium.svg'),
    title: 'Grid',
    body: `Orbit Grids automatically persist their state. They can be easily arranged and resized, and plugging in app data inside them is as easy as nesting an <AppCard />.`,
    image: listScreen,
    iconAfter: require('../../public/logos/sheets.svg'),
    afterName: 'GSheets',
    beforeName: 'Crawler',
    link: '/docs/grid',
  },
]

const variants = {
  enter: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
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

export default memo(() => {
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
      {/* pink left */}
      <Page.BackgroundParallax
        speed={-0.5}
        offset={0.3}
        x="-65%"
        scale={1.8}
        className="glow-one"
        opacity={0.23}
        background="radial-gradient(circle closest-side, #D25CCD, transparent)"
      />

      {/* teal right */}
      <Page.BackgroundParallax
        speed={0.3}
        offset={0.2}
        x="60%"
        scale={1.3}
        className="glow-two"
        opacity={0.4}
        background="radial-gradient(circle closest-side, #12A1CC, transparent)"
      />

      <SpacedPageContent
        nodeRef={Fade.ref}
        padding={['12vh', '0%']}
        header={
          <>
            <FadeInView delayIndex={0}>
              <PillButton>Build</PillButton>
            </FadeInView>
            <FadeInView delayIndex={1}>
              <TitleText textAlign="center" size="xxl">
                Make apps, easy
              </TitleText>
            </FadeInView>
            <TitleTextSub margin="auto" minWidth={320}>
              <FadeInView sm-display="inline" delayIndex={2}>
                Create an app, plug in data, deploy. Easier than ever.
              </FadeInView>
            </TitleTextSub>
          </>
        }
      >
        <Col maxWidth="100%" margin={[0, 'auto']} sm-margin={0}>
          <Row space {...mediaStyles.visibleWhen.notsm}>
            <SubSection maxWidth="33%">
              <FadeInView {...fadeAnimations.left} delayIndex={4}>
                <PillButtonDark>Import</PillButtonDark>
                <Space />
                <CenterText>
                  Plug in the <Inline color="#E01C5A">{elements[index].beforeName}</Inline> data
                  source & others with a click.
                </CenterText>
              </FadeInView>
            </SubSection>
            <SubSection flex={2} padding={[true, 'xxl']}>
              <FadeInView delayIndex={5} {...fadeAnimations.up}>
                <PillButtonDark>Display</PillButtonDark>
                <Space />
                <CenterText maxWidth={400} margin={[0, 'auto']}>
                  A fully integrated workspace with rich, powerful views: virtualized, customizable,
                  designed for large data.
                </CenterText>
              </FadeInView>
            </SubSection>
            <SubSection maxWidth="33%">
              <FadeInView {...fadeAnimations.right} delayIndex={4}>
                <PillButtonDark>Export</PillButtonDark>
                <Space />
                <CenterText>
                  Install <Inline color="#F14336">{elements[index].afterName}</Inline>, use it's
                  simple API to send your results out.
                </CenterText>
              </FadeInView>
            </SubSection>
          </Row>

          <Space />

          <Row space>
            <Flex alignItems="center" sm-display="none">
              <FadeInView {...fadeAnimations.left} delayIndex={5}>
                <Image
                  userSelect="none"
                  alignSelf="center"
                  width={80}
                  height={80}
                  src={elements[index].iconBefore}
                />
              </FadeInView>
              <Space size="xxl" />
              <FadeInView
                key={`arrowBefore-${page}`}
                {...fadeAnimations.left}
                delayIndex={6}
                alignSelf="flex-end"
              >
                <Image
                  userSelect="none"
                  opacity={0.5}
                  src={require('../../public/images/curve-arrow.svg')}
                  transform={{
                    scale: 0.8,
                  }}
                />
              </FadeInView>
            </Flex>
            <Flex
              flex={2}
              alignItems="center"
              position="relative"
              margin={0}
              sm-margin={[0, '-5%']}
            >
              <FadeInView width="100%" delayIndex={7} {...fadeAnimations.up}>
                <Button
                  coat="flat"
                  cursor="pointer"
                  size={1.8}
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
                  coat="flat"
                  cursor="pointer"
                  size={1.8}
                  iconSize={20}
                  circular
                  zIndex={100}
                  position="absolute"
                  top={-4}
                  right={5}
                  icon="chevron-right"
                  onClick={() => paginate(1)}
                />
              </FadeInView>

              <FadeInView {...fadeAnimations.up} delayIndex={6} marginBottom={-200} zIndex={10}>
                <TiltSquircle
                  {...linkProps(elements[index].link)}
                  tagName="div"
                  width={280}
                  height={280}
                  background={`linear-gradient(125deg, #78009F, #4C1966)`}
                  boxShadow="0 20px 70px rgba(0,0,0,0.8)"
                  padding={30}
                  cursor="pointer"
                  key={`squircle-${page}`}
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
              </FadeInView>

              <FadeInView
                transition={transitions.slowNotBouncy}
                {...fadeAnimations.up}
                delayIndex={7}
                width="100%"
                height={300}
                position="relative"
              >
                <AnimatePresence initial={false} custom={direction}>
                  <View
                    key={`image-${page}`}
                    custom={direction}
                    variants={variants}
                    width="100%"
                    height="100%"
                    borderRadius={22}
                    boxShadow={[[0, 10, 30, [0, 0, 0]]]}
                    overflow="hidden"
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 100, damping: 200 },
                      opacity: { duration: 0.2 },
                    }}
                    position="absolute"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
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
              </FadeInView>
            </Flex>

            <Flex alignItems="center" sm-display="none">
              <FadeInView {...fadeAnimations.right} delayIndex={5}>
                <Image
                  userSelect="none"
                  alignSelf="center"
                  width={80}
                  height={80}
                  key={`iconAfter-${page}`}
                  custom={direction}
                  variants={variants}
                  src={elements[index].iconAfter}
                />
              </FadeInView>
              <Space size="xxl" />
              <FadeInView delayIndex={6} alignSelf="flex-start">
                <Image
                  key={`arrowAfter-${page}`}
                  custom={direction}
                  variants={variants}
                  userSelect="none"
                  opacity={0.5}
                  transform={{
                    rotate: '275deg',
                    scale: 0.8,
                  }}
                  src={require('../../public/images/curve-arrow.svg')}
                />
              </FadeInView>
            </Flex>
          </Row>

          <FadeInView delayIndex={8} flexDirection="row" margin={[32, 'auto', 0]}>
            {[0, 1, 2].map(x => (
              <Dot key={`dot-${x}`} active={x === index} onClick={() => goTo(x)} />
            ))}
          </FadeInView>
        </Col>
      </SpacedPageContent>
    </Fade.FadeProvide>
  )
})
