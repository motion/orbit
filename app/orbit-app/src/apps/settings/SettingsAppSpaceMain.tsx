import { useObserveOne } from '@mcro/model-bridge'
import { AppType, SpaceModel } from '@mcro/models'
import { Text } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { Title } from '../../views'
import { Section } from '../../views/Section'
import { SubSection } from '../../views/SubSection'
import { AppProps } from '../AppProps'

export default observer(function SettingsAppSpaces({ appConfig }: AppProps<AppType.settings>) {
  const space = useObserveOne(SpaceModel, { where: { id: +appConfig.id } })

  return (
    <Section sizePadding={2}>
      <Title>Manage space: {appConfig.title}</Title>

      <SubSection title="Authentication">
        <Text size={1.1}>Choose which integration grants access to this space.</Text>
      </SubSection>

      {JSON.stringify(space)}
    </Section>
  )
})
