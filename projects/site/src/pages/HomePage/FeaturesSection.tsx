import { Grid, Space, View } from '@o/ui'
import React, { memo } from 'react'

import { FadeChild, useFadePage } from '../../views/FadeInView'
import { MediaSmallHidden } from '../../views/MediaView'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SectionIcon, SectionP, SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

const dly = 200

export default memo(() => {
  const Fade = useFadePage()
  return (
    <Fade.FadeProvide>
      <SpacedPageContent
        height="auto"
        flex={1}
        margin="auto"
        header={
          <>
            <FadeChild delay={0}>
              <PillButton>App Kit</PillButton>
            </FadeChild>
            <FadeChild delay={100}>
              <TitleText
                textAlign="center"
                // TODO
                size="xxl"
                // size={useScreenVal('lg', 'xxxl', 'xxxl')}
              >
                Batteries Included.
              </TitleText>
            </FadeChild>
            <TitleTextSub>
              <FadeChild delay={200}>The vertically integrated workspace for work apps.</FadeChild>
            </TitleTextSub>
          </>
        }
      />

      <View flex={1} maxHeight={50} />

      <Grid
        nodeRef={Fade.ref}
        alignItems="start"
        space={30}
        itemMinWidth={280}
        maxWidth={800}
        margin={[0, 'auto']}
      >
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

        <SimpleSection delay={dly * 4} title="Cross-platform, fast interface.">
          <SectionP>
            <SectionIcon name="widget" />A desktop-class UI kit with views that work together both
            in composition and shared prop types.
            <MediaSmallHidden>
              <>
                <Space />
                Layouts, templates, combining views and more.
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
