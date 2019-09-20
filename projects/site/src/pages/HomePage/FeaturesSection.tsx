import { Grid, Row, Space, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useState } from 'react'

import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'

const dly = 200

const sectionNames = ['Collaborate', 'App Kit', 'Publish']

const sections = {
  [sectionNames[0]]: [
    {
      title: 'Apps work together',
      icon: 'apps',
      body: [
        `Apps talk with simple typed APIs. Orbit comes with many data apps.`,
        `They can also sync data into a common format to display, share and export.`,
      ],
    },
    {
      title: `Spaces to collaborate`,
      icon: `satellite`,
      body: [
        `The easiest collaboration story. No servers to setup or credentials to share.`,
        `Press edit and in seconds deploy a rich app to everyone.`,
      ],
    },
    {
      title: `Stunning, easy apps`,
      icon: `shop`,
      body: [
        `A new platform designed from the ground up to make common apps easy to build, using modern TypeScript and an incredible build system designed for developer friendliness.`,
        `Publish in seconds on the app store.`,
      ],
    },
    {
      title: `Next-gen interface`,
      icon: `widget`,
      body: [
        `A desktop-class UI kit -- fast, intuitive, with views that work well together and adapt to your data structures.`,
        `With layouts and templates for many use cases.`,
      ],
    },
  ],
  [sectionNames[1]]: [
    {
      title: 'The latest React, Typescript & Webpack',
      icon: 'apps',
      body: [
        `React Refresh hot reloading, with React Concurrent rendering out of the box. Plus, support for Suspense data-loading built into every library and view.`,
      ],
    },
    {
      title: `Worlds Best Hot Reloading`,
      icon: `satellite`,
      body: [
        `The easiest collaboration story. No servers to setup or credentials to share.`,
        `Press edit and in seconds deploy a rich app to everyone.`,
      ],
    },
    {
      title: `Mulitprocess`,
      icon: `shop`,
      body: [
        `A new platform designed from the ground up to make common apps easy to build, using modern TypeScript and an incredible build system designed for developer friendliness.`,
        `Publish in seconds on the app store.`,
      ],
    },
    {
      title: `Incredible Dev Tooling`,
      icon: `widget`,
      body: [
        `A desktop-class UI kit -- fast, intuitive, with views that work well together and adapt to your data structures.`,
        `With layouts and templates for many use cases.`,
      ],
    },
  ],
  [sectionNames[2]]: [
    {
      title: 'Query Builder',
      icon: 'apps',
      body: [
        `Apps talk to each other with simple typed APIs. Orbit comes with many data apps.`,
        `They can also sync data into a common format to display, share and export.`,
      ],
    },
    {
      title: `GraphQL Explorer`,
      icon: `satellite`,
      body: [
        `The easiest collaboration story. No servers to setup or credentials to share.`,
        `Press edit and in seconds deploy a rich app to everyone.`,
      ],
    },
    {
      title: `Manage/Sync Bits`,
      icon: `shop`,
      body: [
        `A new platform designed from the ground up to make common apps easy to build, using modern TypeScript and an incredible build system designed for developer friendliness.`,
        `Publish in seconds on the app store.`,
      ],
    },
    {
      title: `Clipboard`,
      icon: `widget`,
      body: [
        `A desktop-class UI kit -- fast, intuitive, with views that work well together and adapt to your data structures.`,
        `With layouts and templates for many use cases.`,
      ],
    },
  ],
}

export default memo(() => {
  const Fade = useFadePage()
  const [activeSection, setActiveSection] = useState(sectionNames[0])
  const btnProps = (section: string) => {
    return {
      cursor: 'pointer',
      letterSpacing: 3,
      onClick: () => {
        setActiveSection(section)
      },
      borderWidth: 1,
      background: 'transparent',
      ...(activeSection !== section && {}),
      ...(activeSection === section && {
        background: '#11124A',
        borderColor: '#fff',
      }),
    } as const
  }
  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={0.3}
        zIndex={-1}
        opacity={0.45}
        offset={1.5}
        x="-55%"
        scale={1.5}
        background="radial-gradient(circle closest-side, #8B1944, transparent)"
      />

      <SpacedPageContent
        nodeRef={Fade.ref}
        height="auto"
        flex={1}
        margin="auto"
        header={
          <>
            <FadeInView delayIndex={0}>
              <PillButton>Features</PillButton>
            </FadeInView>
            <FadeInView delayIndex={1}>
              <TitleText textAlign="center" size="xl">
                Batteries Included
              </TitleText>
            </FadeInView>
            <FadeInView delayIndex={1} {...fadeAnimations.up}>
              <Row justifyContent="center" space="lg" margin={[15, 'auto', 0]}>
                {sectionNames.map(section => (
                  <React.Fragment key={section}>
                    <PillButtonDark {...btnProps(section)}>{section}</PillButtonDark>
                  </React.Fragment>
                ))}
              </Row>
            </FadeInView>
          </>
        }
      />

      <View flex={1} minHeight={80} />

      <FadeInView delayIndex={2} {...fadeAnimations.up}>
        <Grid space={80} alignItems="start" itemMinWidth={280} maxWidth={800} margin={[0, 'auto']}>
          {sections[activeSection].map(({ title, icon, body }, index) => (
            <SimpleSection key={`${activeSection}${index}`} delay={dly * (index + 1)} title={title}>
              <SectionP>
                <SectionIcon name={icon} />
                {flatMap(body, (x, i) => {
                  return (
                    <React.Fragment key={`${activeSection}${i}`}>
                      {+i === body.length - 1 ? (
                        x
                      ) : (
                        <>
                          {x}
                          <Space />
                        </>
                      )}
                    </React.Fragment>
                  )
                })}
              </SectionP>
            </SimpleSection>
          ))}
        </Grid>
      </FadeInView>

      <View flex={1} sm-flex={0} lg-flex={2} />

      <Space size="xl" />
    </Fade.FadeProvide>
  )
})
