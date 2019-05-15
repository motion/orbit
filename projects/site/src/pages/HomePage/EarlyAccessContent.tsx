import { Theme } from 'gloss'
import React from 'react'

import { Link } from '../../views/LinkProps'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SignupForm } from './SignupForm'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export const EarlyAccessContent = () => {
  return (
    <SpacedPageContent
      alignItems="center"
      header={
        <>
          <PillButton>Beta</PillButton>
          <TitleText size="xxl">Early Access.</TitleText>
          <TitleTextSub size={useScreenVal('sm', 'md', 'md')}>
            Join orbit insiders for early access.
          </TitleTextSub>
        </>
      }
    >
      <Theme name="darkAlt">
        <SignupForm />
      </Theme>
      <TitleTextSub margin={[0, 'auto']} size="xs">
        Have a unique use case? <Link href="mailto:hi@tryorbit.com">Contact us</Link>.
      </TitleTextSub>
    </SpacedPageContent>
  )
}
