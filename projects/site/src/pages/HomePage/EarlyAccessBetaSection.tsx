import { FullScreen, View, ViewProps } from '@o/ui'
import React from 'react'

import { useIsTiny } from '../../hooks/useScreenSize'
import { Link } from '../../views/LinkProps'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { Join } from './Join'
import { LineSep } from './LineSep'
import { Wavy } from './purpleWaveUrl'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default function EarlyAccessSection({ outside = null }: any) {
  const isTiny = useIsTiny()
  return (
    <>
      <Page.Content
        zIndex={10}
        outside={
          <>
            <FullScreen background={theme => theme.background} top={80} />
            <LineSep top={-20} fill />
            <LineSep
              top="auto"
              bottom={0}
              height={120}
              left={0}
              right={0}
              width="100%"
              minWidth={1200}
              transform={{ scaleX: -1 }}
              zIndex={1}
            />
            {outside}
          </>
        }
      >
        <View margin={['auto', 0]} padding={[20, 0]} transform={{ y: isTiny ? 0 : '-5%' }}>
          <EarlyAccessContent />
        </View>
      </Page.Content>
    </>
  )
}

export const EarlyAccessContent = () => {
  return (
    <SpacedPageContent
      header={
        <>
          <PillButton>Beta</PillButton>
          <TitleText size="xxl">Early Access.</TitleText>
          <TitleTextSub size={useScreenVal('sm', 'md', 'md')}>Orbit is now in beta.</TitleTextSub>
          <TitleTextSub size="xs">
            Have a unique use case? <Link href="mailto:hi@tryorbit.com">Contact us</Link>.
          </TitleTextSub>
        </>
      }
    >
      <SignupForm />
    </SpacedPageContent>
  )
}

export const SignupForm = (props: ViewProps) => (
  <View
    width="50%"
    maxWidth={600}
    minWidth={340}
    margin="auto"
    borderRadius={12}
    overflow="hidden"
    elevation={3}
    background={theme => theme.backgroundStrong}
    {...props}
  >
    <Wavy width="100%" height={16} />
    <View pad="lg">
      <Join
        header={
          <>
            <TitleTextSmallCaps alpha={1}>Beta Signup</TitleTextSmallCaps>
            <TitleTextSub size="xs">We're rolling out to teams now.</TitleTextSub>
          </>
        }
        space="md"
      />
    </View>

    <Wavy width="100%" height={16} />
  </View>
)

const TitleTextSmallCaps = props => (
  <TitleTextSub letterSpacing={2} textTransform="uppercase" size={0.2} {...props} />
)
