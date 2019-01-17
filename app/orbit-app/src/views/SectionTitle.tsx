import { gloss } from '@mcro/gloss'
import { Row } from '@mcro/ui'
import * as React from 'react'
import { SubTitle } from '.'
import { RoundButtonSmall } from './RoundButtonSmall'

const SectionRow = gloss(Row, {}).theme((_, theme) => ({
  background: theme.background,
}))

export const SectionTitle = ({ children, ...props }) => (
  <SectionRow {...props}>
    <SubTitle margin={0} padding={[2, 4, 0]} fontWeight={500} fontSize={13}>
      {children}
    </SubTitle>
    <div style={{ flex: 1 }} />
    <RoundButtonSmall
      icon="remove"
      iconProps={{ size: 9 }}
      opacity={0}
      hoverStyle={{ opacity: 1 }}
    />
  </SectionRow>
)
