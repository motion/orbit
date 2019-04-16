import { Col, Grid, Image, Space, Theme } from '@o/ui'
import React from 'react'
import bottomLightSeparator from '../../../public/images/bottom-sep.svg'
import lightSeparator from '../../../public/images/light-separator.svg'
import people from '../../../public/images/people.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { SpacedPageContent } from './SpacedPageContent'

export function WaistSection(props) {
  const screen = useScreenSize()
  return (
    <Theme name="light">
      <Page {...props}>
        <Page.Content
          outside={
            <>
              <Image
                transform={{ scaleX: -1 }}
                position="absolute"
                top={-120}
                height={120}
                left={0}
                right={0}
                width="100%"
                minWidth={1200}
                src={lightSeparator}
              />

              <Image
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                width="100%"
                src={bottomLightSeparator}
              />
            </>
          }
        >
          <SpacedPageContent
            padding={[0, '5%']}
            margin={[0, 'auto']}
            maxWidth={900}
            header={
              <>
                <PillButton>Security</PillButton>
                <Space size="sm" />
                <TitleText size="lg" fontWeight={300} maxWidth={400}>
                  Tell Security they can firewall Orbit completely.
                </TitleText>
                <Space />
              </>
            }
          >
            <Grid space={screen === 'small' ? 20 : '15%'} itemMinWidth={320}>
              <Col space="xl">
                <Pitch size="md">
                  Orbit never sends a single bit of data outside your firewall.
                </Pitch>

                <Pitch size="xs">
                  Get incredibly powerful internal tools, without having to trust a startup with any
                  of your internal data -- from interfacing with sensitive internal databases to
                  visualizing imporant metrics, Orbit runs locally so you have control.
                </Pitch>
              </Col>

              <Image margin="auto" padding={20} src={people} />
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} bottom={50} />
      </Page>
    </Theme>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
