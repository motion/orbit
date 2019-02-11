import * as React from 'react'
import { Title } from '../../../../views'
import { Section } from '../../../../views/Section'
import AtlassianSettingLogin from '../../../views/shared/AtlassianSettingLogin'

export const ConfluenceSetup = () => (
  <Section>
    <Title>Confluence</Title>
    <AtlassianSettingLogin type="confluence" />
  </Section>
)
