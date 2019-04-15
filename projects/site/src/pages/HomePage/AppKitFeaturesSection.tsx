import { FullScreen, Grid, PassProps, Space } from '@o/ui'
import React from 'react'
import redshift from '../../../public/images/redshift.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './DemoSection'
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
                Most internal tools have the same patterns. Orbit makes building many types of
                simple applications easy.
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
            <PassProps
              getChildProps={(_, index) => ({
                index: index + 1,
                ...(screen !== 'small' && index % 2 === 1 && { transform: { y: '100%' } }),
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
