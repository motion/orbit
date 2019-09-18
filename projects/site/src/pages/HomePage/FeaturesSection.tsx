import { Grid, Row, Space, View } from '@o/ui'
import { flatMap } from 'lodash'
import React, { memo, useState } from 'react'

import { FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

const dly = 200

const sections = {
  Apps: [
    {
      title: 'Apps work together.',
      icon: 'apps',
      body: [
        `Apps talk with simple typed APIs. Orbit comes with many data apps.`,
        `They can also sync data into a common format to display, share and export.`,
      ],
    },
    {
      title: `Spaces to collaborate.`,
      icon: `satellite`,
      body: [
        `The easiest collaboration story. No servers to setup or credentials to share.`,
        `Press edit and in seconds deploy a rich app to everyone.`,
      ],
    },
    {
      title: `Stunning, easy apps.`,
      icon: `shop`,
      body: [
        `A new platform designed from the ground up to make common apps easy to build, using modern TypeScript and an incredible build system designed for developer friendliness.`,
        `Publish in seconds on the app store.`,
      ],
    },
    {
      title: `Next-gen interface.`,
      icon: `widget`,
      body: [
        `A desktop-class UI kit -- fast, intuitive, with views that work well together and adapt to your data structures.`,
        `With layouts and templates for many use cases.`,
      ],
    },
  ],
  Tech: [
    {
      title: 'React Concurrent, Suspense & Refresh.',
      icon: 'apps',
      body: [
        `Apps talk to each other with simple typed APIs. Orbit comes with many data apps.`,
        `They can also sync data into a common format to display, share and export.`,
      ],
    },
    {
      title: `Worlds Best Hot Reloading.`,
      icon: `satellite`,
      body: [
        `The easiest collaboration story. No servers to setup or credentials to share.`,
        `Press edit and in seconds deploy a rich app to everyone.`,
      ],
    },
    {
      title: `Background workers.`,
      icon: `shop`,
      body: [
        `A new platform designed from the ground up to make common apps easy to build, using modern TypeScript and an incredible build system designed for developer friendliness.`,
        `Publish in seconds on the app store.`,
      ],
    },
    {
      title: `Incredible Dev Tooling.`,
      icon: `widget`,
      body: [
        `A desktop-class UI kit -- fast, intuitive, with views that work well together and adapt to your data structures.`,
        `With layouts and templates for many use cases.`,
      ],
    },
  ],
  Platform: [
    {
      title: 'Query Builder.',
      icon: 'apps',
      body: [
        `Apps talk to each other with simple typed APIs. Orbit comes with many data apps.`,
        `They can also sync data into a common format to display, share and export.`,
      ],
    },
    {
      title: `GraphQL Explorer.`,
      icon: `satellite`,
      body: [
        `The easiest collaboration story. No servers to setup or credentials to share.`,
        `Press edit and in seconds deploy a rich app to everyone.`,
      ],
    },
    {
      title: `Manage/Sync Bits.`,
      icon: `shop`,
      body: [
        `A new platform designed from the ground up to make common apps easy to build, using modern TypeScript and an incredible build system designed for developer friendliness.`,
        `Publish in seconds on the app store.`,
      ],
    },
    {
      title: `Natural Language Search.`,
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
  const [activeSection, setActiveSection] = useState('Apps')
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
        speed={0.4}
        zIndex={-1}
        opacity={0.45}
        offset={1.1}
        x="-55%"
        scale={2.2}
        background="radial-gradient(circle closest-side, #8B2028, transparent)"
      />

      <SpacedPageContent
        nodeRef={Fade.ref}
        height="auto"
        flex={1}
        margin="auto"
        header={
          <>
            <PillButton>Features</PillButton>
            <FadeInView delay={0}>
              <TitleText
                textAlign="center"
                size="xxl"
                // TODO
                // sm-size="lg"
              >
                Batteries Included.
              </TitleText>
            </FadeInView>
            <TitleTextSub>
              <FadeInView delay={200}>
                The vertically integrated workspace for work apps.
              </FadeInView>
            </TitleTextSub>
          </>
        }
      />

      <Space />

      <Row justifyContent="center" space="lg" margin={[0, 'auto']}>
        {['Apps', 'Tech', 'Platform'].map(section => (
          <React.Fragment key={section}>
            <PillButtonDark {...btnProps(section)}>{section}</PillButtonDark>
          </React.Fragment>
        ))}
      </Row>

      <View flex={1} minHeight={80} />

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

      <View flex={1} sm-flex={0} lg-flex={2} />

      <Space size="xl" />
    </Fade.FadeProvide>
  )
})
