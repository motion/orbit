import { FullScreen, Grid, PassProps, Space } from '@o/ui'
import React from 'react'
import redshift from '../../../public/images/redshift.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
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
                integrated, which saves code, time, bugs.
              </TitleTextSub>
            </>
          }
        >
          <Space size="lg" />
          <Grid
            alignItems="start"
            space="15%"
            itemMinWidth={240}
            maxWidth={800}
            margin={[0, 'auto']}
          >
            <PassProps getChildProps={(_, index) => ({ index: index + 1 })}>
              <SimpleSection title="Apps that work together.">
                <SectionP>
                  <SectionIcon name="apps" />
                  It's time we could build apps that talk to each other. Orbit comes with many data
                  apps already, and has an open ecosystem for unlimited collaboration.
                  <Space />
                  Because every app exposes an API, your team can start leveraging a whole world of
                  new possibilities.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="A space to collaborate.">
                <SectionP>
                  <SectionIcon name="satellite" />
                  Today, intranets are places where things go to die. Orbit wants to make it so easy
                  to build apps together, that your team turns a stale and boring portal into an
                  iron-man interface for everyone at your company.
                  <Space />
                  It starts with the Workspace, where all your apps are available to use and edit.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="A privacy-first, decentralized app store.">
                <SectionP>
                  <SectionIcon name="shop" />
                  Publish new apps for your team or for the world. Every app can run on it's own
                  using well-developed standards, and follows a TypeScript API.
                  <Space />
                  Install apps and data sources from the app store to expand your teams abilities.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="A UI kit to rival Native (really).">
                <SectionP>
                  <SectionIcon name="widget" />
                  Building a proper list is no joke. Either is a table, form, or popover. But that's
                  just the start.
                  <Space />
                  Making them all work together well, within flows, with disparate data structures,
                  and in beautiful interfaces is where Orbit shines.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="An incredible development experience for everyone.">
                <SectionP>
                  <SectionIcon name="app" />
                  It's not just no-config. It's taking time to get everything from team-data and
                  user-data management, to complex multi-app flows, and making them all work
                  together with simple, easy pieces.
                  <Space />
                  Read our docs to get started.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Open source and decentralized.">
                <SectionP>
                  <SectionIcon name="globe" />
                  We're tired of platforms coming and going. We want something better for ourselves,
                  that we can trust to build on.
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

      <Page.Parallax speed={0.5} zIndex={-2}>
        <FullScreen
          className="northern-lights"
          backgroundImage={`url(${redshift})`}
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
          bottom="-100%"
        />
      </Page.Parallax>
    </Page>
  )
}
