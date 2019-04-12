import { Col, FullScreen, gloss, Image, Row, Space, SpaceGroup, Text, Title, View } from '@o/ui'
import React from 'react'
import northernlights from '../../../public/images/northern-lights.svg'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButtonDark } from '../../views/PillButtonDark'
import { Spotlight } from '../../views/Spotlight'
import { Squircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'

export function NeckSection() {
  return (
    <Page offset={1}>
      <Page.Content>
        <View margin={['auto', 0]}>
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
                  padding={40}
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
                  <Paragraph sizeLineHeight={1.3} size={1.1}>
                    A table that has it all. Virtualized, resizable, sortable, filterable,
                    multiselectable, and more. One more line to attach it to a form.
                  </Paragraph>
                </Squircle>
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
          <Space size="xxl" />
          <Space size="xxl" />
        </View>
      </Page.Content>

      <Page.Background background={theme => theme.background} />

      <Page.Parallax speed={0.1} zIndex={-2}>
        <FullScreen
          className="northern-lights"
          backgroundImage={`url(${northernlights})`}
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundRepeat="none"
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
