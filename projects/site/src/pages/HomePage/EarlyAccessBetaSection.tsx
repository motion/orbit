import { Space, View, ViewProps } from '@o/ui'
import React from 'react'

import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { Join } from './Join'
import { LineSep } from './LineSep'
import { Wavy } from './purpleWaveUrl'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'

export default function EarlyAccessSection({ outside = null }: any) {
  return (
    <>
      <Page.Content
        zIndex={10}
        outside={
          <>
            <LineSep top={-10} fill />
            {outside}
          </>
        }
      >
        <View margin={['auto', 0]} transform={{ y: '-3%' }}>
          <EarlyAccessContent />
        </View>
      </Page.Content>

      <Page.Background background={theme => theme.background} top={80} />
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
          <TitleTextSub>Have a unique case for internal tools? Contact us.</TitleTextSub>
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
    {...props}
  >
    <Wavy width="100%" height={16} />
    <View pad="lg">
      <Join
        header={
          <>
            <TitleTextSmallCaps alpha={1}>Beta Signup</TitleTextSmallCaps>
            <Space size="sm" />
            <TitleTextSub size="xs">We're rolling out to teams now.</TitleTextSub>
          </>
        }
        space="lg"
      />
    </View>

    <Wavy width="100%" height={16} />
  </View>
)

const TitleTextSmallCaps = props => (
  <TitleTextSub letterSpacing={2} textTransform="uppercase" size={0.2} {...props} />
)
