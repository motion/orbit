import { Col, FullScreen, gloss, Image, Row, Space, TextProps, Title, View } from '@o/ui'
import React from 'react'
import northernlights from '../../../public/images/northern-lights.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButtonDark } from '../../views/PillButtonDark'
import { Spotlight } from '../../views/Spotlight'
import { Squircle } from '../../views/Squircle'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'

export const TitleTextSub = gloss((props: TextProps) => (
  <View width="70%" minWidth={400} textAlign="center">
    <TitleText size={1.8} sizeLineHeight={1.4} fontWeight={200} alpha={0.5} {...props} />
  </View>
))

export function NeckSection(props) {
  const screen = useScreenSize()
  return (
    <Page {...props}>
      <Page.Content>
        <SpacedPageContent
          header={
            <>
              <TitleText size="xxl">All in one.</TitleText>
              <TitleText size="lg" fontWeight={200}>
                The vertically integrated app platform.
              </TitleText>
              <TitleTextSub>
                Orbit handles everything from data to interface to deploy letting you create
                beautiful apps with just a few lines of code, without ever touching config or
                servers.
              </TitleTextSub>
            </>
          }
        >
          <Col spaceAround maxWidth="100%" margin={[0, 'auto']}>
            <Row space flexWrap="wrap">
              <SubSection>
                <PillButtonDark>Import</PillButtonDark>
                <Space />
                <CenterText>
                  Add a data app from the app store with a click, and integrate it with just a line
                  of code.
                </CenterText>
              </SubSection>
              <SubSection flex={1.5} pad={[true, 'xxl']}>
                <PillButtonDark>Display</PillButtonDark>
                <Space />
                <CenterText>
                  Orbit includes incredibly powerful building blocks for common apps, that all work
                  together. Link a table to a form to any data with ease.
                </CenterText>
              </SubSection>
              <SubSection>
                <PillButtonDark>Export</PillButtonDark>
                <Space />
                <CenterText>
                  Data apps are flexible and work together. Select a few items from a table and send
                  to Gmail with ease.
                </CenterText>
              </SubSection>
            </Row>

            <Space />

            <Row space>
              <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                <Image
                  alignSelf="center"
                  width={124}
                  height={124}
                  src={require('../../../public/logos/slack.svg')}
                />
                <Space size="xxl" />
                <Image
                  opacity={0.5}
                  alignSelf="flex-end"
                  src={require('../../../public/images/curve-arrow.svg')}
                />
              </Flex>
              <Flex flex={2}>
                <Squircle
                  width={280}
                  height={280}
                  background="linear-gradient(125deg, #78009F, #4C1966)"
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

                <View
                  marginTop={-200}
                  background="grey"
                  width="100%"
                  height={300}
                  borderRadius={10}
                  elevation={10}
                />
              </Flex>

              <Flex alignItems="center" display={screen === 'small' ? 'none' : 'inherit'}>
                <Image
                  alignSelf="center"
                  width={124}
                  height={124}
                  src={require('../../../public/logos/gmail.svg')}
                />
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
          </Col>
        </SpacedPageContent>
      </Page.Content>

      <Page.Parallax speed={0.4} zIndex={-2}>
        <FullScreen
          className="northern-lights"
          backgroundImage={`url(${northernlights})`}
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
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
