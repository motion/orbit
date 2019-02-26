import { Section, Title } from '@mcro/ui'
import * as React from 'react'
import { AtlassianSettingLogin } from '../../views/AtlassianSettingLogin'

export const JiraSetup = () => (
  <Section>
    <Title>Jira</Title>
    <AtlassianSettingLogin identifier="jira" />
  </Section>
)
