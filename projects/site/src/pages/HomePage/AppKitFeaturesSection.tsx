import {
  Button,
  ButtonProps,
  FullScreen,
  gloss,
  Grid,
  Image,
  PassProps,
  Row,
  Space,
  View,
} from '@o/ui'
import React from 'react'
import orbits from '../../../public/images/orbits.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { useSiteStore } from '../../Layout'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'

const FadeDown = gloss(FullScreen).theme((_, theme) => ({
  background: `linear-gradient(transparent, ${theme.background} 65%)`,
}))

export function ChestSection(props) {
  const screen = useScreenSize()
  const { sectionHeight } = useSiteStore()
  return (
    <Page {...props}>
      <Page.Parallax speed={-0.05} zIndex={-2}>
        <FullScreen transform={{ y: '-96%', scale: 0.7 }} transformOrigin="bottom center">
          <FullScreen
            top="auto"
            height="50%"
            className="orbits"
            backgroundImage={`url(${orbits})`}
            backgroundPosition="top center"
            backgroundRepeat="no-repeat"
          />
          <FadeDown top="auto" height="50%" />
        </FullScreen>
      </Page.Parallax>

      <Page.Content height={sectionHeight * 2} flex={1}>
        <SpacedPageContent
          maxHeight={100000}
          margin={screen === 'small' ? ['-50%', 0, '10%'] : ['-15%', 0, '6%']}
          height="auto"
          header={
            <>
              <PillButton>Data</PillButton>
              <Space size="xs" />
              <TitleText size="lg">Data, meet app.</TitleText>
              <TitleTextSub alpha={0.9} size="md">
                The first platform where apps know how to talk to each other.
              </TitleTextSub>
              <TitleTextSub size="xs">
                Add any integration with a click. Create your own with ease.
              </TitleTextSub>
            </>
          }
        >
          <Row
            className="hide-scrollbars"
            height="auto"
            space="md"
            spaceAround
            scrollable="x"
            justifyContent="center"
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

          <Space />

          <Row space margin={[0, 'auto']}>
            <BodyButton>Installing an integration</BodyButton>

            <BodyButton>Writing an integration</BodyButton>
          </Row>
        </SpacedPageContent>

        <Space size="xxl" />

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
              <SimpleSection title="Apps work together.">
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
                  Anyone on your team can use, edit, and add new apps. All done decentralized, so
                  you can do it behind the firewall.
                  <Space />
                  Press edit and in seconds deploy a rich collaborative app to everyone.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Decentralized app store.">
                <SectionP>
                  <SectionIcon name="shop" />
                  Publish new apps for your team, or for the world. Apps are just node modules, with
                  a typed API and a clean view system built on React.
                  <Space />
                  Apps also expose data, so you can build your own.
                </SectionP>
              </SimpleSection>

              <SimpleSection title="Native-level UI Kit.">
                <SectionP>
                  <SectionIcon name="widget" />
                  A proper, powerful and flexible list view is no joke. Neither is a table or form.
                  But that's just the start.
                  <Space />
                  Orbit makes them work together, accepting similar data formats and normalizing
                  them easily. Plus, Orbit understands how to lay them out when they are used
                  together.
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

          <View flex={3} />

          <BodyButton margin={[0, 'auto']} size="xl">
            Read the feature overview
          </BodyButton>
        </SpacedPageContent>
      </Page.Content>

      <Page.Background
        speed={-0.2}
        zIndex={100}
        bottom="-110%"
        backgroundSize="cover"
        left="-40%"
        right="-40%"
        width="180%"
        top="40%"
        backgroundPosition="top center"
        opacity={0.78}
        backgroundImage={`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%231f1f1f' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%231b1b1b' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%23181818' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%23151515' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%23111111' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%230e0e0e' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%230b0b0b' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%23000000' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%23000000' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%23000000' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E")`}
      />

      {/* <Page.Parallax speed={0.25} zIndex={-2}>
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
      </Page.Parallax> */}
    </Page>
  )
}

export const BodyButton = (props: ButtonProps) => (
  <Button
    sizePadding={1.6}
    sizeRadius={2}
    cursor="pointer"
    tagName="a"
    textDecoration="none"
    borderWidth={0}
    {...props}
  />
)

const Integration = props => (
  <View alignItems="center" justifyContent="center">
    <Image src={props.icon} maxWidth={130} width="50%" height="auto" />
    <Space />
    <Paragraph size="xl">{props.title}</Paragraph>
  </View>
)
