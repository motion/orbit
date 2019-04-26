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

export const bottomSeparator = bottomLightSeparator

export default function WaistSection(props) {
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
                top="-17%"
                height={120}
                left={0}
                right={0}
                width="100%"
                minWidth={1200}
                src={lightSeparator}
              />

              <Image
                position="absolute"
                bottom={90}
                height={90}
                left={0}
                right={0}
                width="100%"
                src={bottomSeparator}
              />
            </>
          }
        >
          <SpacedPageContent
            padding={[0, '5%']}
            margin={[0, 'auto']}
            maxWidth={860}
            transform={{
              y: '-4%',
            }}
            header={
              <>
                <PillButton>Security</PillButton>
                <Space size="sm" />
                <TitleText size="lg" maxWidth={400}>
                  Tell Security they can firewall Orbit completely.
                </TitleText>
                <Space />
              </>
            }
          >
            <Grid space={screen === 'small' ? 20 : '10% 5%'} itemMinWidth={300}>
              <Col space="xl">
                <Pitch size="md">
                  No servers, no problem. Orbit syncs without ever sending single bit of data
                  outside your firewall.
                </Pitch>

                <Pitch size="sm">
                  <ol>
                    <li>Install Orbit.app.</li>
                    <li>Create apps with your team.</li>
                    <li>That's it.</li>
                  </ol>
                </Pitch>

                <Pitch alpha={0.7} size="xs">
                  Get incredibly powerful internal tools without setting up infrastructure or having
                  to trust a startup with any of your data -- interface with sensitive internal
                  databases with ease, Orbit gives you complete control.
                </Pitch>
              </Col>

              {screen !== 'small' && <Image margin="auto" padding={20} src={people} />}
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} bottom={150} />
      </Page>
    </Theme>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
