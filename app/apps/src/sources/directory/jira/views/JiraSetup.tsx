import { Title } from '@mcro/ui'
import * as React from 'react'
import AtlassianSettingLogin from '../../../views/shared/AtlassianSettingLogin'

export const JiraSetup = () => (
  <section>
    <Title>Jira</Title>
    <AtlassianSettingLogin type="jira" />
  </section>
)
