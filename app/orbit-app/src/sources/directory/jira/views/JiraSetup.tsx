import * as React from 'react'
import { Title } from '../../../../views'
import { Section } from '../../../../views/Section'
import AtlassianSettingLogin from '../../../views/shared/AtlassianSettingLogin'

export const JiraSetup = () => (
  <Section>
    <Title>Jira</Title>
    <AtlassianSettingLogin type="jira" />
  </Section>
)
