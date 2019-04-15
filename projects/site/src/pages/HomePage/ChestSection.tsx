import { FullScreen, Grid, PassProps, Space } from '@o/ui'
import React from 'react'
import redshift from '../../../public/images/redshift.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'

export function ChestSection(props) {
  const screen = useScreenSize()
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
            space="20%"
            itemMinWidth={240}
            maxWidth={800}
            margin={[0, 'auto']}
          >
            <PassProps
              getChildProps={(_, index) => ({
                index: index + 1,
                ...(screen !== 'small' && index % 2 === 1 && { transform: { y: '60%' } }),
              })}
            >
              <SimpleSection title="Apps that work together.">
                <SectionP>
                  <SectionIcon name="apps" />
                  It's time we could build apps that talk to each other. Orbit comes with many data
                  apps already, and has an open ecosystem for unlimited collaboration.
                  <Space />
                  Every app exposes a typed API, and can share data with any other app.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="A space to collaborate.">
                <SectionP>
                  <SectionIcon name="satellite" />
                  Orbit wants to make it so easy to build apps together that once-boring portals
                  turn into an rich interfaces for everyone at your company.
                  <Space />
                  It starts with the Workspace, where all your apps are available to use and edit.
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

              <SimpleSection title="A UI kit to rival native.">
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
                  It's not just no-config and easy to use. We've spent time getting patterns for
                  many common app use cases easy: from reactive data to easily syncing.
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
                  It's everything you'd want in a mature app platform.
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
          backgroundSize="contain"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
          bottom="-100%"
        />
      </Page.Parallax>
    </Page>
  )
}
