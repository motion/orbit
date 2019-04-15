import { FullScreen, Grid, Image, PassProps, Row, Space, View } from '@o/ui'
import React from 'react'
import redshift from '../../../public/images/redshift.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { useSiteStore } from '../../Layout'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'

export function ChestSection(props) {
  const screen = useScreenSize()
  const { sectionHeight } = useSiteStore()
  return (
    <Page {...props}>
      <Page.Content height={sectionHeight * 2} flex={1}>
        <SpacedPageContent
          maxHeight={100000}
          margin={0}
          height="auto"
          transform={{
            y: '-10%',
          }}
          header={
            <>
              <PillButton>Integrations</PillButton>
              <Space size="xs" />
              <TitleText size="lg">Data, meet apps.</TitleText>
              <TitleTextSub>Easy to plug in integrations. Write your own if you need.</TitleTextSub>
            </>
          }
        >
          <Row
            width="60%"
            margin={[0, 'auto']}
            height="auto"
            space="lg"
            spaceAround
            flexWrap={screen === 'small' ? 'nowrap' : 'wrap'}
            scrollable={screen === 'small' ? 'x' : false}
            justifyContent={screen === 'small' ? 'flex-start' : 'center'}
          >
            <Integration icon={require('../../../public/logos/slack.svg')} title="Slack" />
            <Integration
              icon={require('../../../public/logos/github-octocat.svg')}
              title="Github"
            />
            <Integration icon={require('../../../public/logos/gmail.svg')} title="Gmail" />
            <Integration icon={require('../../../public/logos/drive.svg')} title="Drive" />
            <Integration
              icon={require('../../../public/logos/confluence.svg')}
              title="Confluence"
            />
            <Integration icon={require('../../../public/logos/jira.svg')} title="Jira" />
            <Integration icon={require('../../../public/logos/sheets.svg')} title="Sheets" />
            <Integration icon={require('../../../public/logos/postgres.svg')} title="Postgres" />
          </Row>
        </SpacedPageContent>

        <Space size="lg" />

        <SpacedPageContent
          maxHeight={100000}
          height="auto"
          flex={1}
          margin={[0, 'auto']}
          header={
            <>
              <PillButton>App Kit</PillButton>
              <Space size="xs" />
              <TitleText size="xxl">Batteries Included.</TitleText>
              <TitleTextSub>
                Internal tools share patterns. Orbit makes building those types of apps easy.
              </TitleTextSub>
            </>
          }
        >
          <Space size="lg" />
          <Grid
            alignItems="start"
            space={screen === 'small' ? '40px 15%' : '20% 15%'}
            itemMinWidth={240}
            maxWidth={800}
            margin="auto"
          >
            <PassProps
              getChildProps={(_, index) => ({
                index: screen === 'small' ? undefined : index + 1,
                ...(screen !== 'small' && index % 2 === 1 && { transform: { y: '70%' } }),
              })}
            >
              <SimpleSection title="Apps that work together.">
                <SectionP>
                  <SectionIcon name="apps" />
                  Apps talk to each other with simple typed APIs. Orbit comes with many data apps.
                  <Space />
                  They can also sync data into a common format to display, share and export.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  <SectionIcon name="satellite" />
                  A unified workspace keeps your team in sync. Press edit and in seconds deploy a
                  rich collaborative app to everyone.
                  <Space />
                  Learn more about spaces.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="A decentralized app store.">
                <SectionP>
                  <SectionIcon name="shop" />
                  Publish new apps for your team, or for the world. Apps are just node modules, with
                  a typed API and a clean view system built on React.
                  <Space />
                  Apps also expose data, so you can build your own.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="A UI kit to rival native.">
                <SectionP>
                  <SectionIcon name="widget" />
                  A proper, powerful and flexible list view is no joke. Neither is a table or form.
                  But that's just the start.
                  <Space />
                  Orbit makes them all work together, within flows and with disparate data
                  structures.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="An incredible development experience.">
                <SectionP>
                  <SectionIcon name="app" />
                  It's not just no-config and easy to use. We've spent time getting patterns for
                  many common app use cases right: from data to display.
                  <Space />
                  Read our docs to get started.
                </SectionP>
              </SimpleSection>
            </PassProps>
          </Grid>

          <View flex={4} />
        </SpacedPageContent>
      </Page.Content>

      <Page.Parallax speed={0.15} zIndex={-2}>
        <FullScreen
          transform={{
            y: '30%',
          }}
          className="northern-lights"
          backgroundImage={`url(${redshift})`}
          backgroundSize="contain"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
          bottom="-100%"
        />
      </Page.Parallax>
    </Page>
  )
}

const Integration = props => (
  <View alignItems="center" justifyContent="center">
    <Image src={props.icon} maxWidth={100} width="50%" height="auto" />
    <Space />
    <Paragraph size="xl">{props.title}</Paragraph>
  </View>
)
