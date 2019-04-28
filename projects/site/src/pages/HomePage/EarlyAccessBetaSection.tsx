import sepFilled from '!raw-loader!../../../public/images/line-sep-filled.svg'
import sep from '!raw-loader!../../../public/images/line-sep.svg'
import { Space, SVG, useTheme, View, ViewProps } from '@o/ui'
import React, { memo } from 'react'

import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { Join } from './Join'
import { Wavy } from './purpleWaveUrl'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'

export default function EarlyAccessSection({ outside = null, ...props }: any) {
  return (
    <Page zIndex={1} {...props}>
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
    </Page>
  )
}

export const LineSep = memo(
  ({
    fill = null,
    noOverlay = false,
    ...props
  }: ViewProps & { fill?: any; noOverlay?: boolean }) => {
    const theme = useTheme()
    let svg = fill
      ? sepFilled.replace(
          'fill="#000000"',
          `fill="${fill === true ? theme.background.hex() : fill}"`,
        )
      : sep

    if (noOverlay) {
      svg = svg.replace(`fill="url(#linearGradient-1)"`, '')
    }
    return (
      <View
        color={theme.background}
        position="absolute"
        top={0}
        width="100%"
        minWidth={1200}
        height={100}
        {...props}
      >
        <SVG svg={svg} width="100%" />
      </View>
    )
  },
)

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
