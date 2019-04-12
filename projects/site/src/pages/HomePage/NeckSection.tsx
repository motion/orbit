import { Col, FullScreen, gloss, Image, Row, Space, SpaceGroup, Text, View } from '@o/ui'
import React from 'react'
import northernlights from '../../../public/images/northern-lights.svg'
import { Page } from '../../views/Page'
import { PillButtonDark } from '../../views/PillButtonDark'
import { Squircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'

export function NeckSection() {
  return (
    <Page offset={1}>
      <Page.Content>
        <SpaceGroup>
          <Col space="md" alignItems="center" pad="xl">
            <TitleText size="xxl">Everything included.</TitleText>
            <TitleText size="lg" fontWeight={200}>
              No config, no servers + a desktop-class UI kit.
            </TitleText>
            <TitleText size="md" fontWeight={200} alpha={0.5}>
              Orbit comes with an incredibly large, flexible, and powerful toolkit out of the box.
            </TitleText>
          </Col>

          <Row space>
            <Flex>
              <PillButtonDark>Import</PillButtonDark>
              <Space />
              <CenterText>Add Slack with a click. Data apps integrate seamlessly.</CenterText>
            </Flex>
            <Flex flex={2}>
              <PillButtonDark>Import</PillButtonDark>
              <Space />
              <CenterText>Add Slack with a click. Data apps integrate seamlessly.</CenterText>
            </Flex>
            <Flex>
              <PillButtonDark>Import</PillButtonDark>
              <Space />
              <CenterText>Add Slack with a click. Data apps integrate seamlessly.</CenterText>
            </Flex>
          </Row>

          <Space />

          <Row space>
            <Flex alignItems="center">
              <img width={124} height={124} src={require('../../../public/logos/slack.svg')} />
              <Space size="xxl" />
              <Image
                opacity={0.5}
                alignSelf="flex-end"
                src={require('../../../public/images/curve-arrow.svg')}
              />
            </Flex>
            <Flex flex={2}>
              {/* Squircle! */}
              <Squircle
                width={280}
                height={280}
                background="linear-gradient(45deg, #78009F, #4C1966)"
                boxShadow="0 10px 50px rgba(0,0,0,0.5)"
                margin="auto"
              />
            </Flex>
            <Flex>
              <img width={124} height={124} src={require('../../../public/logos/gmail.svg')} />
              <Space size="xxl" />
              <Image
                opacity={0.5}
                alignSelf="flex-start"
                transform={{
                  scaleX: -1,
                }}
                src={require('../../../public/images/curve-arrow.svg')}
              />
            </Flex>
          </Row>
        </SpaceGroup>
      </Page.Content>

      <Page.Background background={theme => theme.background} />

      <Page.Parallax speed={0.1} zIndex={-2}>
        <FullScreen
          className="northern-lights"
          backgroundImage={`url(${northernlights})`}
          backgroundSize="contain"
          backgroundPosition="top left"
        />
        <Spotlight />
      </Page.Parallax>
    </Page>
  )
}

const CenterText = gloss(Text, {
  textAlign: 'center',
})
CenterText.defaultProps = {
  selectable: true,
}

const Flex = gloss(View, {
  position: 'relative',
  flex: 1,
})

const Spotlight = () => {
  return (
    <>
      <Above />
      <Row>
        <Left />
        <Square
          className="spotlight"
          zIndex={10}
          background="radial-gradient(circle farthest-side, transparent, black)"
        />
        <Right />
      </Row>
      <Below />
    </>
  )
}

const Square = gloss(View, {
  width: '80vw',
  height: '80vw',
})

const bg = (_, theme) => ({ background: theme.background })

const Above = gloss({
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Below = gloss({
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Left = gloss({
  flex: 1,
  zIndex: 10,
}).theme(bg)

const Right = gloss({
  flex: 1,
  zIndex: 10,
}).theme(bg)
