import { Col, FullScreen, gloss, Image, Row, Space, TextProps, Title, View } from '@o/ui'
import React from 'react'
import northernlights from '../../../public/images/northern-lights.svg'
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

export function NeckSection() {
  return (
    <Page offset={1}>
      <Page.Content>
        <SpacedPageContent
          header={
            <>
              <TitleText size="xxl">Everything included.</TitleText>
              <TitleText size="lg" fontWeight={200}>
                No config, no servers + a desktop-class UI kit.
              </TitleText>
              <TitleTextSub>
                Orbit comes with an incredibly large, flexible, and powerful toolkit out of the box.
              </TitleTextSub>
            </>
          }
        >
          <Col spaceAround maxWidth={1000} margin={[0, 'auto']}>
            <Row space>
              <SubSection>
                <PillButtonDark>Import</PillButtonDark>
                <Space />
                <CenterText>Add Slack with a click. Data apps integrate seamlessly.</CenterText>
              </SubSection>
              <SubSection flex={1.5} pad={[true, 'xxl']}>
                <PillButtonDark>Display</PillButtonDark>
                <Space />
                <CenterText>
                  Views and layouts that work together. It's everything you need for internal tools.
                </CenterText>
              </SubSection>
              <SubSection>
                <PillButtonDark>Export</PillButtonDark>
                <Space />
                <CenterText>Add button to send to Gmail, with just a line of code.</CenterText>
              </SubSection>
            </Row>

            <Space />

            <Row space>
              <Flex alignItems="center">
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

                <View marginTop={-200} background="grey" width="100%" height={300} />
              </Flex>
              <Flex alignItems="center">
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

      {/* <Page.Background background={theme => theme.background} /> */}

      <Page.Parallax speed={0.1} zIndex={-2}>
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

const SubSection = gloss(props => <Flex pad {...props} />)
