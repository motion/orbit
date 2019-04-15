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
            y: '-18%',
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
          <Row space="lg" spaceAround flexWrap="wrap" justifyContent="center">
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

        <Space size="xxxl" />

        <SpacedPageContent
          maxHeight={100000}
          height="auto"
          margin={[0, 'auto']}
          header={
            <>
              <PillButton>App Kit</PillButton>
              <Space size="xs" />
              <TitleText size="xxl">Batteries Included.</TitleText>
              <TitleTextSub>
                Most internal tools have the same patterns. Orbit makes building many types of
                simple applications easy.
              </TitleTextSub>
            </>
          }
        >
          <Space size="lg" />
          <Grid
            alignItems="start"
            space={screen === 'small' ? '40px 15%' : '12% 15%'}
            itemMinWidth={240}
            maxWidth={800}
            margin={[0, 'auto']}
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
                  Apps that talk to each other, by exposing simple typed APIs. Orbit comes with many
                  data apps out of the box.
                  <Space />
                  Apps can sync data in a common format that then lets you display, select, and
                  share between other apps.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Spaces to collaborate.">
                <SectionP>
                  <SectionIcon name="satellite" />
                  Your apps live together in a unified workspace. With little code you can create
                  rich collaborative apps that everyone can use.
                  <Space />
                  Then, anyone in the workspace can easily edit an app with the press of a button.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="A decentralized app store.">
                <SectionP>
                  <SectionIcon name="shop" />
                  Publish new apps for your team or for the world. Every app can run on it's own
                  using well-developed standards, and follows a TypeScript API.
                  <Space />
                  Install apps and data sources from the app store to expand your teams abilities.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="The UI kit that rivals native.">
                <SectionP>
                  <SectionIcon name="widget" />
                  Building a proper list is no joke. Either is a table, form, or popover. But that's
                  just the start.
                  <Space />
                  Making them all work together well, within flows, with disparate data structures,
                  and in beautiful interfaces is where Orbit shines.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="An incredible development experience.">
                <SectionP>
                  <SectionIcon name="app" />
                  It's not just no-config and easy to use. We've spent time getting patterns for
                  many common app use cases easy: from reactive data to easily syncing.
                  <Space />
                  Read our docs to get started.
                </SectionP>
              </SimpleSection>
            </PassProps>

            <Space size="xxl" />
          </Grid>
        </SpacedPageContent>
      </Page.Content>

      <Page.Parallax speed={0.5} zIndex={-2}>
        <FullScreen
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
    <Image src={props.icon} width="50%" height="auto" />
    <Space />
    <Paragraph size="xl">{props.title}</Paragraph>
  </View>
)
