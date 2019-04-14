import { Grid, PassProps, Space } from '@o/ui'
import React from 'react'
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

              <SimpleSection title="Apps that share data.">
                <SectionP>
                  <SectionIcon name="grid" />
                  The big goal we're aiming for is giving power back to the end users. It's more
                  than just control, it's allowing for collaboration and a new ecosystem of rich
                  data providers and components that can handle them.
                  <Space />
                  Orbit enforces a decentralized and private-first design that means every app must
                  sync it's data into common structural formats that will realize a huge boom in
                  sharing between data sources and apps.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="An full featured UI kit.">
                <SectionP>
                  <SectionIcon name="ok" />
                  A big part of the pain of app development today is putting together powerful
                  interfaces. Typically with web apps you're forced to glue together many different
                  pieces, each with varying levels of performance, and none with consistency.
                  <Space />
                  Orbit built a state of the art style system and a huge, rich UI kit that handles
                  complex use cases like having easy to use groupable, searchable, filterable, and
                  selectable virtualized lists and tables.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="A privacy-first, decentralized app store.">
                <SectionP>
                  <SectionIcon name="home" />
                  Collaborate with teammates in a shared workspace on apps you build together,
                  syncing all their relevant data and configuration behind the firewall.
                  <Space />
                  Then, install apps and data sources from the ap store to expand your teams
                  abilities, and contribute your own back!
                </SectionP>
              </SimpleSection>

              <SimpleSection title="An incredible development experience for everyone.">
                <SectionP>
                  <SectionIcon name="app" />
                  Hot reloading, when done well, realizes a huge leap forward in developer
                  productivity. Orbit gives you state of the art hot reloading out of the box.
                  <Space />
                  When combined with a large toolkit of primitives that virtualize and parallelize
                  hard work automatically, you get something truly hard to achieve: incredible
                  developer experience, without throwing out performance.
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
