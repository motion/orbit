import { Grid, Row, Space, View } from '@o/ui'
import React, { memo, useState } from 'react'

import { FadeInView, useFadePage } from '../../views/FadeInView'
import { MediaSmallHidden } from '../../views/MediaView'
import { PillButton } from '../../views/PillButton'
import { PillButtonDark } from '../../views/PillButtonDark'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

const dly = 200

export default memo(() => {
  const Fade = useFadePage()
  const [activeSection, setActiveSection] = useState('Features')
  const btnProps = (section: string) => {
    return {
      cursor: 'pointer',
      letterSpacing: 3,
      onClick: () => {
        setActiveSection(section)
      },
    } as const
  }
  return (
    <Fade.FadeProvide>
      <SpacedPageContent
        nodeRef={Fade.ref}
        height="auto"
        flex={1}
        margin="auto"
        header={
          <>
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

      <Row justifyContent="center" space margin={[0, 'auto']}>
        {['Features', 'Tech', 'Platform'].map(section => (
          <React.Fragment key={section}>
            {section === activeSection ? (
              <PillButton {...btnProps(section)}>{section}</PillButton>
            ) : (
              <PillButtonDark {...btnProps(section)}>{section}</PillButtonDark>
            )}
          </React.Fragment>
        ))}
      </Row>

      <View flex={1} minHeight={80} />

      <Grid space={80} alignItems="start" itemMinWidth={280} maxWidth={800} margin={[0, 'auto']}>
        <SimpleSection delay={dly * 1} title="Apps work together.">
          <SectionP>
            <SectionIcon name="apps" />
            Apps talk to each other with simple typed APIs. Orbit comes with many data apps.
            <MediaSmallHidden>
              <Space />
              They can also sync data into a common format to display, share and export.
            </MediaSmallHidden>
          </SectionP>
        </SimpleSection>

        <SimpleSection delay={dly * 2} title="Spaces to collaborate.">
          <SectionP>
            <SectionIcon name="satellite" />
            The easiest collaboration story. No servers to setup or credentials to share.
            <MediaSmallHidden>
              <>
                <Space />
                Press edit and in seconds deploy a rich app to everyone.
              </>
            </MediaSmallHidden>
          </SectionP>
        </SimpleSection>

        <SimpleSection delay={dly * 3} title="Stunning, easy apps.">
          <SectionP>
            <SectionIcon name="shop" />A new platform designed from the ground up to make common
            apps easy to build, using modern TypeScript and an incredible build system designed for
            developer friendliness.
            <MediaSmallHidden>
              <>
                <Space />
                Publish in seconds on the app store.
              </>
            </MediaSmallHidden>
          </SectionP>
        </SimpleSection>

        <SimpleSection delay={dly * 4} title="Next-gen interface.">
          <SectionP>
            <SectionIcon name="widget" />A desktop-class UI kit -- fast, intuitive, with views that
            work well together and adapt to your data structures.
            <MediaSmallHidden>
              <>
                <Space />
                With layouts and templates for many use cases.
              </>
            </MediaSmallHidden>
          </SectionP>
        </SimpleSection>
      </Grid>

      <View flex={1} sm-flex={0} lg-flex={2} />

      <Space size="xl" />
    </Fade.FadeProvide>
  )
})
