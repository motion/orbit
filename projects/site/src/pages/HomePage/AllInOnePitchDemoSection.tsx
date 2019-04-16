import { Inline } from '@o/gloss'
import { Button, Col, FullScreen, gloss, Image, Row, Space, TextProps, Title, View } from '@o/ui'
import React, { useState } from 'react'
import { animated, useSpring } from 'react-spring'
import northernlights from '../../../public/images/northern-lights.svg'
import tableScreen from '../../../public/images/screen-table.jpg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButtonDark } from '../../views/PillButtonDark'
import { Spotlight } from '../../views/Spotlight'
import { Squircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'

export const TitleTextSub = gloss((props: TextProps) => (
  <View width="90%" maxWidth={800} minWidth={300} textAlign="center">
    <TitleText size="sm" sizeLineHeight={1.2} fontWeight={300} alpha={0.5} {...props} />
  </View>
))

const nextStyle = {
  opacity: 0,
  transform: `translate3d(40px,0,0)`,
}
const curStyle = {
  opacity: 1,
  transform: `translate3d(0,0,0)`,
}
const prevStyle = {
  opacity: 0,
  transform: `translate3d(-40px,0,0)`,
}
let animate = 'in'

const sleep = ms => new Promise(res => setTimeout(res, ms))

function useSlideSpring(config, delay = 0) {
  return useSpring({
    from: nextStyle,
    to: async next => {
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
              duration: 250,
            },
          })
          // move to other side
          await next({
            to: {
              opacity: 0,
              transform: `translate3d(40px,0,0)`,
            },
            config: {
              duration: 200,
            },
          })
          await sleep(delay)
          // in
          await next({
            to: curStyle,
            config,
          })
          return
      }
    },
    config,
  })
}

export function NeckSection(props) {
  const screen = useScreenSize()

  const springFastest = useSlideSpring({
    mass: 1,
    tension: 100,
    friction: 10,
  })
  const springFast = useSlideSpring(
    {
      mass: 1,
      tension: 100,
      friction: 10,
    },
    40,
  )
  const springMedium = useSlideSpring(
    {
      mass: 1,
      tension: 80,
      friction: 8,
    },
    80,
  )
  const springSlow = useSlideSpring(
    {
      mass: 1,
      tension: 65,
      friction: 8,
    },
    250,
  )
  const springSlowest = useSlideSpring(
    {
      mass: 1,
      tension: 65,
      friction: 8,
    },
    300,
  )

  const [cur, setCur] = useState(0)

  const next = async () => {
    animate = 'next'
    setCur(cur + 1)
  }
  const prev = () => {
    setCur(cur + 1)
  }

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
              <TitleText size="xxxl">All together.</TitleText>
              <TitleTextSub>
                Many internal tools share common patterns. Orbit gives you everything you need to
                build them easily - even the development environment.
              </TitleTextSub>
            </>
          }
        >
          <Col maxWidth="100%" margin={[0, 'auto']}>
            {screen !== 'small' && (
              <Row space flexWrap={screen === 'small' ? 'wrap' : 'nowrap'}>
                <SubSection maxWidth="33%">
                  <PillButtonDark>Import</PillButtonDark>
                  <Space />
                  <CenterText>
                    Many data integrations built in, integrate with a line of code.
                  </CenterText>
                </SubSection>
                <SubSection flex={2} pad={[true, 'xxl']}>
                  <PillButtonDark>Display</PillButtonDark>
                  <Space />
                  <CenterText>
                    A cohesive, large and custom UI kit that focuses on making it easy to move data
                    between it's views.
                  </CenterText>
                </SubSection>
                <SubSection maxWidth="33%">
                  <PillButtonDark>Export</PillButtonDark>
                  <Space />
                  <CenterText>
                    With easy selection + actions, exporting data to{' '}
                    <Inline color="#F14336">Gmail</Inline> is easy.
                  </CenterText>
                </SubSection>
              </Row>
            )}

            <Space />

            <Row space>
              <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                <animated.div style={springFastest}>
                  <Image
                    alignSelf="center"
                    width={124}
                    height={124}
                    src={require('../../../public/logos/slack.svg')}
                  />
                </animated.div>
                <Space size="xxl" />
                <Image
                  opacity={0.5}
                  alignSelf="flex-end"
                  src={require('../../../public/images/curve-arrow.svg')}
                  transform={{
                    scale: 0.8,
                  }}
                />
              </Flex>
              <Flex flex={2} position="relative">
                <Button
                  alt="clear"
                  size={2}
                  iconSize={22}
                  circular
                  position="absolute"
                  top={-4}
                  left={10}
                  icon="chevron-left"
                  onClick={prev}
                />
                <Button
                  alt="clear"
                  size={2}
                  iconSize={22}
                  circular
                  position="absolute"
                  top={-4}
                  right={10}
                  icon="chevron-right"
                  onClick={next}
                />

                <animated.div style={{ ...springMedium, margin: 'auto' }}>
                  <Squircle
                    width={280}
                    height={280}
                    background="linear-gradient(125deg, #78009F, #4C1966)"
                    boxShadow="0 10px 50px rgba(0,0,0,0.5)"
                    padding={30}
                  >
                    <Title
                      fontSize={18}
                      margin={[0, 'auto']}
                      letterSpacing={2}
                      alpha={0.65}
                      textTransform="uppercase"
                    >
                      {'<Table />'}
                    </Title>
                    <Space />
                    <Paragraph sizeLineHeight={1.2} size={1.2}>
                      The table that has it all. Virtualized, resizable, sortable, filterable,
                      multi-selectable, and more. With easy sharing to forms, lists, or other apps
                      in your Orbit.
                    </Paragraph>
                  </Squircle>
                </animated.div>

                <animated.div style={{ ...springSlow, marginTop: -215, height: 300, zIndex: -1 }}>
                  <View
                    backgroundImage={`url(${tableScreen})`}
                    backgroundSize="101%"
                    backgroundPosition="-1px -2px -2px -2px"
                    width="100%"
                    height={300}
                    borderRadius={10}
                    elevation={30}
                  />
                </animated.div>
              </Flex>

              <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                <animated.div style={springSlowest}>
                  <Image
                    alignSelf="center"
                    width={124}
                    height={124}
                    src={require('../../../public/logos/gmail.svg')}
                  />
                </animated.div>
                <Space size="xxl" />
                <Image
                  opacity={0.5}
                  alignSelf="flex-start"
                  transform={{
                    rotate: '275deg',
                    scale: 0.8,
                  }}
                  src={require('../../../public/images/curve-arrow.svg')}
                />
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
        size: 1.2,
        alpha: 0.85,
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

const SubSection = gloss(props => <Flex minWidth={280} pad {...props} />)
