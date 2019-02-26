import { Section, Title } from '@mcro/ui'
import * as React from 'react'
import { AtlassianSettingLogin } from '../../views/AtlassianSettingLogin'

export const ConfluenceSetup = () => (
  <Section>
    <Title>Confluence</Title>
    <AtlassianSettingLogin type="confluence" />
  </Section>
)
