import { Col, gloss, Grid, Icon, PassProps, Row, Space, Text } from '@o/ui'
import React from 'react'
import { Page } from '../../views/Page'
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
                Creating, maintaining, and collaborating apps shouldn't be so hard. Orbit tackles
                the hard problems of development, deployment and toolkit.
              </TitleTextSub>
            </>
          }
        >
          <Space size="lg" />
          <Grid space="15%" itemMinWidth={240} maxWidth={800} margin={[0, 'auto']}>
            <PassProps getChildProps={(_, index) => ({ index: index + 1 })}>
              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                </SectionP>
                <SectionIcon name="grid" />
                <SectionP>
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                </SectionP>
                <SectionIcon name="grid" />
                <SectionP>
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                </SectionP>
                <SectionIcon name="grid" />
                <SectionP>
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                </SectionP>
                <SectionIcon name="grid" />
                <SectionP>
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                </SectionP>
                <SectionIcon name="grid" />
                <SectionP>
                  Collaborate on new data sources components. It's everything you'd want in a mature
                  app platform, and none of the downsides of having to glue together an intranet
                  yourself.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  Orbit gives your company a home that you control completely. Everything is synced
                  peer to peer, and apps can even sync data to a common format to collaborate with
                  each other.
                </SectionP>
                <SectionIcon name="grid" />
                <SectionP>
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
  <SectionChrome space="sm">
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

const SectionP = gloss(props => <Text size={1.1} alpha={0.65} sizeLineHeight={1.1} {...props} />, {
  display: 'block',
  float: 'left',
})

const SectionBody = gloss({
  display: 'block',
})

const SectionIcon = gloss(Icon, {
  float: 'right',
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
  border: [1, theme.color],
}))

const BadgeText = gloss({
  transform: {
    y: '15%',
    x: '55%',
  },
})
