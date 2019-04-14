import { Col, gloss, Grid, Icon, PassProps, Row, Space } from '@o/ui'
import React from 'react'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SpacedPageContent } from './SpacedPageContent'

export function ChestSection(props) {
  return (
    <Page {...props}>
      <Page.Content>
        <SpacedPageContent
          header={
            <>
              <PillButton>App Kit</PillButton>
              <Space size="sm" />
              <TitleText size="xxl">Batteries Included.</TitleText>
              <TitleTextSub>
                Orbit gives you a rich set of tools that are common to many apps. They're completely
                integrated, which saves tons of code, time, and enables new features.
              </TitleTextSub>
            </>
          }
        >
          <Space size="lg" />
          <Grid space="15%" itemMinWidth={240} maxWidth={800} margin={[0, 'auto']}>
            <PassProps getChildProps={(_, index) => ({ index: index + 1 })}>
              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  <SectionIcon name="cog" />
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                  <Space />
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  <SectionIcon name="grid" />
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                  <Space />
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  <SectionIcon name="ok" />
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                  <Space />
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  <SectionIcon name="home" />
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                  <Space />
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  <SectionIcon name="app" />
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                  <Space />
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  <SectionIcon name="can" />
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                  <Space />
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>
            </PassProps>
          </Grid>
        </SpacedPageContent>
      </Page.Content>

      {/* <Page.Background background={theme => theme.background} /> */}
    </Page>
  )
}

const SimpleSection = props => (
  <SectionChrome space>
    <SectionTitle>
      <Badge>
        <BadgeText>{props.index}.</BadgeText>
      </Badge>
      <TitleText textAlign="left" flex={1}>
        {props.title}
      </TitleText>
    </SectionTitle>
    <SectionBody>{props.children}</SectionBody>
  </SectionChrome>
)

const SectionChrome = gloss(Col, {
  position: 'relative',
})

const SectionP = gloss(
  props => <Paragraph size={1.1} alpha={0.65} sizeLineHeight={1.15} {...props} />,
  {
    display: 'block',
    float: 'left',
  },
)

const SectionBody = gloss({
  display: 'block',
})

const SectionIcon = gloss(props => <Icon size={52} {...props} />, {
  float: 'right',
  margin: [8, 0, 16, 16],
})

const SectionTitle = gloss(Row, {
  flex: 1,
  alignItems: 'flex-end',
})

const Badge = gloss({
  position: 'absolute',
  // top: -50,
  transform: {
    x: 'calc(-100% - 15px)',
  },
  width: 50,
  height: 50,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
}).theme((_, theme) => ({
  color: theme.color,
  border: [1, theme.color.alpha(0.25)],
}))

const BadgeText = gloss({
  transform: {
    y: '15%',
    x: '55%',
  },
})
